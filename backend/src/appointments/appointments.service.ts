import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { CreateAppointmentDto, UpdateAppointmentDto, CancelAppointmentDto } from './dto/appointment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    // Validate appointment date is not in the past
    const appointmentDate = new Date(createAppointmentDto.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      throw new BadRequestException('Cannot book appointments in the past');
    }

    // Validate time format and business hours (9 AM to 6 PM)
    const [hours, minutes] = createAppointmentDto.startTime.split(':').map(Number);
    if (hours < 9 || hours >= 18) {
      throw new BadRequestException('Appointments can only be booked between 9 AM and 6 PM');
    }

    // Check if doctor exists and is available
    const doctor = await this.doctorModel.findById(createAppointmentDto.doctorId).exec();
    if (!doctor || !doctor.isAvailable) {
      throw new BadRequestException('Doctor not found or not available');
    }

    // Find or create patient profile for the user
    let patient = await this.patientModel.findOne({ userId }).exec();
    if (!patient) {
      // Create a patient profile if it doesn't exist
      patient = new this.patientModel({
        userId,
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        }
      });
      await patient.save();
    }

    // Ensure doctorId is converted to ObjectId for proper storage and querying
    const doctorIdObjectId = new Types.ObjectId(createAppointmentDto.doctorId);
    
    // Check for time conflicts using ObjectId
    const existingAppointment = await this.appointmentModel.findOne({
      doctorId: doctorIdObjectId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      startTime: createAppointmentDto.startTime,
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    }).exec();

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Calculate end time if not provided (default 1 hour duration)
    let endTime = createAppointmentDto.endTime;
    if (!endTime) {
      const [hours, minutes] = createAppointmentDto.startTime.split(':').map(Number);
      const endHours = hours + 1;
      endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      doctorId: doctorIdObjectId, // Use the ObjectId we created above
      patientId: patient._id, // Use the patient profile ID, not the user ID
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      endTime: endTime,
    });

    const savedAppointment = await appointment.save();
    
    // Ensure user data is properly attached
    if (savedAppointment.patientId && (savedAppointment.patientId as any).userId) {
      (savedAppointment as any).patientUser = (savedAppointment.patientId as any).userId;
    }
    if (savedAppointment.doctorId && (savedAppointment.doctorId as any).userId) {
      (savedAppointment as any).doctorUser = (savedAppointment.doctorId as any).userId;
    }

    // Send notification to doctor
    const notification = await this.notificationsService.create({
      userId: doctor.userId,
      type: 'appointment_reminder' as any,
      title: 'New Appointment Request',
      message: `You have a new appointment request from a patient`,
      data: { appointmentId: savedAppointment._id },
    });

    // Send real-time notification to doctor if they're online
    await this.notificationsGateway.sendNotificationToUser(doctor.userId.toString(), notification);

    return savedAppointment;
  }

  async findAll(filters: any = {}, userId?: string, userRole?: string) {
    const query: any = {};
    
    // Apply role-based filtering for security
    // Administrators can see all appointments
    // Doctors can only see their own appointments
    // Patients can only see their own appointments
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR && userRole !== 'Administrator') {
      // Handle both enum and string role values for flexibility
      if (userRole === UserRole.DOCTOR || userRole === 'Doctor') {
        // Find doctor profile for this user
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (doctor) {
          // Use the doctor's _id directly - MongoDB will match it correctly
          // doctor._id is already an ObjectId, so we can use it as-is
          query.doctorId = doctor._id;
        } else {
          // Doctor profile not found, return empty results
          return [];
        }
      } else if (userRole === UserRole.PATIENT || userRole === 'Patient') {
        // Find patient profile for this user
        const patient = await this.patientModel.findOne({ userId }).exec();
        if (patient) {
          // Use the patient's _id directly - MongoDB will match it correctly
          query.patientId = patient._id;
        } else {
          // Patient profile not found, return empty results
          return [];
        }
      }
    }
    
    // Apply additional filters (only if user has permission)
    // Note: doctorId and patientId filters are only allowed for Administrators
    // or if they match the user's own profile
    if (userRole === UserRole.ADMINISTRATOR) {
      if (filters.doctorId) query.doctorId = filters.doctorId;
      if (filters.patientId) query.patientId = filters.patientId;
    } else {
      // For non-admins, ignore doctorId/patientId filters to prevent unauthorized access
      // The role-based filtering above already ensures they only see their own data
    }
    
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.dateFrom) query.appointmentDate = { $gte: new Date(filters.dateFrom) };
    if (filters.dateTo) {
      query.appointmentDate = {
        ...query.appointmentDate,
        $lte: new Date(filters.dateTo),
      };
    }

    const appointments = await this.appointmentModel
      .find(query)
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phone'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phone'
        }
      })
      .sort({ appointmentDate: -1 })
      .exec();

    // Transform appointments to include appointmentType field for frontend compatibility
    const transformedAppointments = appointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
        // Ensure proper date formatting
        appointmentDate: appointment.appointmentDate,
        // Ensure proper time formatting
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        // Add duration calculation
        duration: this.calculateDuration(appointment.startTime, appointment.endTime),
      };
    });

    return transformedAppointments as any[];
  }

  private calculateDuration(startTime: string, endTime: string): string {
    try {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      const durationMinutes = endMinutes - startMinutes;
      
      if (durationMinutes <= 0) return '30 min'; // Default fallback
      
      return `${durationMinutes} min`;
    } catch (error) {
      return '30 min'; // Default fallback
    }
  }

  async findOne(id: string, userId?: string, userRole?: string): Promise<any> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check authorization - ensure user has access to this appointment
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR) {
      let hasAccess = false;
      
      if (userRole === UserRole.DOCTOR) {
        // Doctor can only access appointments where they are the doctor
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (doctor && appointment.doctorId && appointment.doctorId.toString() === doctor._id.toString()) {
          hasAccess = true;
        }
      } else if (userRole === UserRole.PATIENT) {
        // Patient can only access their own appointments
        const patient = await this.patientModel.findOne({ userId }).exec();
        if (patient && appointment.patientId && appointment.patientId.toString() === patient._id.toString()) {
          hasAccess = true;
        }
      }
      
      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this appointment');
      }
    }

    // Ensure user data is properly attached
    if (appointment.patientId && (appointment.patientId as any).userId) {
      (appointment as any).patientUser = (appointment.patientId as any).userId;
    }
    if (appointment.doctorId && (appointment.doctorId as any).userId) {
      (appointment as any).doctorUser = (appointment.doctorId as any).userId;
    }

    // Transform appointment to include appointmentType field for frontend compatibility
    const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
    const transformedAppointment = {
      ...appointmentObj,
      appointmentType: appointment.type,
    };

    return transformedAppointment as any;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, userId?: string, userRole?: string): Promise<any> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check authorization - ensure user has permission to update this appointment
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR) {
      let hasPermission = false;
      
      if (userRole === UserRole.DOCTOR) {
        // Doctor can update appointments where they are the doctor
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (doctor && appointment.doctorId && appointment.doctorId.toString() === doctor._id.toString()) {
          hasPermission = true;
        }
      } else if (userRole === UserRole.PATIENT) {
        // Patient can update their own appointments (e.g., change problem description)
        const patient = await this.patientModel.findOne({ userId }).exec();
        if (patient && appointment.patientId && appointment.patientId.toString() === patient._id.toString()) {
          // Patients can only update certain fields (not status)
          // Restrict status updates to doctors/admins
          if (updateAppointmentDto.status && updateAppointmentDto.status !== appointment.status) {
            throw new ForbiddenException('Patients cannot change appointment status');
          }
          hasPermission = true;
        }
      }
      
      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission to update this appointment');
      }
    }

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .exec();

    // Ensure user data is properly attached
    if (updatedAppointment.patientId && (updatedAppointment.patientId as any).userId) {
      (updatedAppointment as any).patientUser = (updatedAppointment.patientId as any).userId;
    }
    if (updatedAppointment.doctorId && (updatedAppointment.doctorId as any).userId) {
      (updatedAppointment as any).doctorUser = (updatedAppointment.doctorId as any).userId;
    }

    // Send notification if status changed
    if (updateAppointmentDto.status && updateAppointmentDto.status !== appointment.status) {
      await this.notificationsService.create({
        userId: appointment.patientId,
        type: 'appointment_confirmed' as any,
        title: 'Appointment Status Updated',
        message: `Your appointment status has been updated to ${updateAppointmentDto.status}`,
        data: { appointmentId: appointment._id },
      });
    }

    // Transform appointment to include appointmentType field for frontend compatibility
    const appointmentObj = updatedAppointment.toObject ? updatedAppointment.toObject() : updatedAppointment;
    const transformedAppointment = {
      ...appointmentObj,
      appointmentType: updatedAppointment.type,
    };

    return transformedAppointment as any;
  }

  async cancel(id: string, cancelAppointmentDto: CancelAppointmentDto, cancelledBy: string): Promise<any> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(
        id,
        {
          status: AppointmentStatus.CANCELLED,
          cancellationReason: cancelAppointmentDto.cancellationReason,
          cancelledBy,
          cancelledAt: new Date(),
        },
        { new: true }
      )
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .exec();

    // Ensure user data is properly attached
    if (updatedAppointment.patientId && (updatedAppointment.patientId as any).userId) {
      (updatedAppointment as any).patientUser = (updatedAppointment.patientId as any).userId;
    }
    if (updatedAppointment.doctorId && (updatedAppointment.doctorId as any).userId) {
      (updatedAppointment as any).doctorUser = (updatedAppointment.doctorId as any).userId;
    }

    // Send notification
    await this.notificationsService.create({
      userId: appointment.patientId,
      type: 'appointment_cancelled' as any,
      title: 'Appointment Cancelled',
      message: 'Your appointment has been cancelled',
      data: { appointmentId: appointment._id },
    });

    // Transform appointment to include appointmentType field for frontend compatibility
    const appointmentObj = updatedAppointment.toObject ? updatedAppointment.toObject() : updatedAppointment;
    const transformedAppointment = {
      ...appointmentObj,
      appointmentType: updatedAppointment.type,
    };

    return transformedAppointment as any;
  }

  async remove(id: string) {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await this.appointmentModel.findByIdAndDelete(id).exec();
    return { message: 'Appointment deleted successfully' };
  }

  async getDoctorAppointments(doctorId: string, filters: any = {}, userId?: string, userRole?: string) {
    // Check authorization - only allow if user is an admin, or the doctor themselves
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR) {
      if (userRole === UserRole.DOCTOR) {
        // Doctor can only access their own appointments
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (!doctor || doctor._id.toString() !== doctorId) {
          throw new ForbiddenException('You do not have access to this doctor\'s appointments');
        }
      } else {
        // Patients and other roles cannot access doctor appointments via this endpoint
        throw new ForbiddenException('You do not have access to this doctor\'s appointments');
      }
    }
    
    const query = { doctorId, ...filters };
    return this.findAll(query, userId, userRole);
  }

  async getPatientAppointments(patientId: string, filters: any = {}, userId?: string, userRole?: string) {
    // Check authorization - only allow if user is an admin, or the patient themselves
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR) {
      if (userRole === UserRole.PATIENT) {
        // Patient can only access their own appointments
        const patient = await this.patientModel.findOne({ userId }).exec();
        if (!patient || patient._id.toString() !== patientId) {
          throw new ForbiddenException('You do not have access to this patient\'s appointments');
        }
      } else if (userRole === UserRole.DOCTOR) {
        // Doctors can access patient appointments if they have appointments with that patient
        // This is handled by checking if there are any appointments between this doctor and patient
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (doctor) {
          const hasAppointment = await this.appointmentModel.findOne({
            doctorId: doctor._id,
            patientId: patientId
          }).exec();
          if (!hasAppointment) {
            throw new ForbiddenException('You do not have access to this patient\'s appointments');
          }
        } else {
          throw new ForbiddenException('You do not have access to this patient\'s appointments');
        }
      } else {
        throw new ForbiddenException('You do not have access to this patient\'s appointments');
      }
    }
    
    const query = { patientId, ...filters };
    return this.findAll(query, userId, userRole);
  }

  async getUpcomingAppointments(userId: string, role: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query: any = {
      appointmentDate: { $gte: today },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    };

    // Note: We don't set doctorId/patientId here because findAll() will handle it
    // based on userId and userRole. This ensures consistent filtering and authorization.
    // We just add the date and status filters, and let findAll() apply role-based filtering.
    // Pass the role directly - findAll will handle the enum comparison internally

    return this.findAll(query, userId, role);
  }

  async updateStatus(id: string, status: string, userId?: string, userRole?: string): Promise<any> {
    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check authorization - only doctors and administrators can update appointment status
    if (userRole && userId && userRole !== UserRole.ADMINISTRATOR) {
      if (userRole === UserRole.DOCTOR) {
        // Doctor can update status of their own appointments
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (!doctor || !appointment.doctorId || appointment.doctorId.toString() !== doctor._id.toString()) {
          throw new ForbiddenException('You do not have permission to update this appointment status');
        }
      } else if (userRole === UserRole.PATIENT) {
        // Patients cannot update appointment status (they can only cancel)
        throw new ForbiddenException('Patients cannot update appointment status. Use the cancel endpoint instead.');
      }
    }

    // Update the status
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      )
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phone'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phone'
        }
      })
      .exec();

    // Ensure user data is properly attached
    if (updatedAppointment.patientId && (updatedAppointment.patientId as any).userId) {
      (updatedAppointment as any).patientUser = (updatedAppointment.patientId as any).userId;
    }
    if (updatedAppointment.doctorId && (updatedAppointment.doctorId as any).userId) {
      (updatedAppointment as any).doctorUser = (updatedAppointment.doctorId as any).userId;
    }

    // Transform appointment to include appointmentType field for frontend compatibility
    const appointmentObj = updatedAppointment.toObject ? updatedAppointment.toObject() : updatedAppointment;
    const transformedAppointment = {
      ...appointmentObj,
      appointmentType: updatedAppointment.type,
    };

    return transformedAppointment as any;
  }

}
