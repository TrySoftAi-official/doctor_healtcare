import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { CreateAppointmentDto, UpdateAppointmentDto, CancelAppointmentDto } from './dto/appointment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, patientId: string) {
    // Check if doctor exists and is available
    const doctor = await this.doctorModel.findById(createAppointmentDto.doctorId).exec();
    if (!doctor || !doctor.isAvailable) {
      throw new BadRequestException('Doctor not found or not available');
    }

    // Check for time conflicts
    const existingAppointment = await this.appointmentModel.findOne({
      doctorId: createAppointmentDto.doctorId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      startTime: createAppointmentDto.startTime,
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    }).exec();

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      patientId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
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
    await this.notificationsService.create({
      userId: doctor.userId,
      type: 'appointment_reminder' as any,
      title: 'New Appointment Request',
      message: `You have a new appointment request from a patient`,
      data: { appointmentId: savedAppointment._id },
    });

    return savedAppointment;
  }

  async findAll(filters: any = {}) {
    const query: any = {};
    
    if (filters.doctorId) query.doctorId = filters.doctorId;
    if (filters.patientId) query.patientId = filters.patientId;
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

    // Ensure user data is properly attached
    for (const appointment of appointments) {
      // Handle patient data
      if (appointment.patientId && (appointment.patientId as any).userId) {
        (appointment as any).patientUser = (appointment.patientId as any).userId;
      } else if (appointment.patientId && typeof appointment.patientId === 'string') {
        // If patientId is a string, try to populate it manually
        try {
          const patient = await this.patientModel.findById(appointment.patientId).populate('userId').exec();
          if (patient && patient.userId) {
            (appointment as any).patientUser = patient.userId;
          }
        } catch (error) {
          console.error('Error populating patient:', error);
        }
      }
      
      // Handle doctor data
      if (appointment.doctorId && (appointment.doctorId as any).userId) {
        (appointment as any).doctorUser = (appointment.doctorId as any).userId;
      } else if (appointment.doctorId && typeof appointment.doctorId === 'string') {
        // If doctorId is a string, try to populate it manually
        try {
          const doctor = await this.doctorModel.findById(appointment.doctorId).populate('userId').exec();
          if (doctor && doctor.userId) {
            (appointment as any).doctorUser = doctor.userId;
          }
        } catch (error) {
          console.error('Error populating doctor:', error);
        }
      } else if (appointment.doctorId && typeof appointment.doctorId === 'object' && (appointment.doctorId as any).userId) {
        // If doctorId is already populated with userId
        (appointment as any).doctorUser = (appointment.doctorId as any).userId;
      }
    }

    // Transform appointments to include appointmentType field for frontend compatibility
    const transformedAppointments = appointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    return transformedAppointments as any[];
  }

  async findOne(id: string): Promise<any> {
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

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
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

  async getDoctorAppointments(doctorId: string, filters: any = {}) {
    const query = { doctorId, ...filters };
    return this.findAll(query);
  }

  async getPatientAppointments(patientId: string, filters: any = {}) {
    const query = { patientId, ...filters };
    return this.findAll(query);
  }

  async getUpcomingAppointments(userId: string, role: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query: any = {
      appointmentDate: { $gte: today },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    };

    if (role === 'Doctor') {
      const doctor = await this.doctorModel.findOne({ userId }).exec();
      if (doctor) query.doctorId = doctor._id;
    } else if (role === 'Patient') {
      const patient = await this.patientModel.findOne({ userId }).exec();
      if (patient) query.patientId = patient._id;
    }

    return this.findAll(query);
  }

}
