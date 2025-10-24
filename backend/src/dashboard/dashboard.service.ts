import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { Prescription, PrescriptionDocument } from '../prescriptions/schemas/prescription.schema';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async getAdminDashboard() {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      upcomingAppointments,
      recentAppointments,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: UserRole.PATIENT, isActive: true }),
      this.userModel.countDocuments({ role: UserRole.DOCTOR, isActive: true }),
      this.appointmentModel.countDocuments(),
      this.appointmentModel.countDocuments({
        appointmentDate: { $gte: new Date() },
        status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      }),
      this.appointmentModel
        .find()
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
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
    ]);

    // Get appointment statistics
    const appointmentStats = await this.appointmentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get monthly appointment trends
    const monthlyTrends = await this.appointmentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Get daily appointment trends for the last 7 days
    const dailyTrends = await this.appointmentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Transform recent appointments to include appointmentType field for frontend compatibility
    const transformedRecentAppointments = recentAppointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type, // Map type to appointmentType for frontend
      };
    });

    // Debug logging for recent appointments
    console.log('Recent appointments data:', JSON.stringify(transformedRecentAppointments, null, 2));
    if (transformedRecentAppointments && transformedRecentAppointments.length > 0) {
      console.log('First appointment patient data:', JSON.stringify(transformedRecentAppointments[0].patientId, null, 2));
      console.log('First appointment patient userId:', JSON.stringify(transformedRecentAppointments[0].patientId?.userId, null, 2));
    }

    return {
      metrics: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        upcomingAppointments,
      },
      appointmentStats,
      monthlyTrends,
      dailyTrends,
      recentAppointments: transformedRecentAppointments,
    };
  }

  async getDoctorDashboard(doctorId: string) {
    const [
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      upcomingAppointments,
      recentAppointments,
    ] = await Promise.all([
      this.appointmentModel.countDocuments({ doctorId }),
      this.appointmentModel.countDocuments({ doctorId, status: AppointmentStatus.COMPLETED }),
      this.appointmentModel.countDocuments({ doctorId, status: AppointmentStatus.PENDING }),
      this.appointmentModel.countDocuments({ doctorId, status: AppointmentStatus.CANCELLED }),
      this.appointmentModel
        .find({
          doctorId,
          appointmentDate: { $gte: new Date() },
          status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        })
        .populate({
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ appointmentDate: 1 })
        .limit(10)
        .exec(),
      this.appointmentModel
        .find({ doctorId })
        .populate({
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
    ]);

    // Get patient feedback (if you have a feedback system)
    const patientFeedback = await this.appointmentModel
      .find({ doctorId, status: AppointmentStatus.COMPLETED })
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    // Get daily appointment trends for the doctor for the last 7 days
    const dailyTrends = await this.appointmentModel.aggregate([
      {
        $match: {
          doctorId,
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Transform appointments to include appointmentType field for frontend compatibility
    const transformedUpcomingAppointments = upcomingAppointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    const transformedRecentAppointments = recentAppointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    const transformedPatientFeedback = patientFeedback.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    return {
      metrics: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
      },
      dailyTrends,
      upcomingAppointments: transformedUpcomingAppointments,
      recentAppointments: transformedRecentAppointments,
      patientFeedback: transformedPatientFeedback,
    };
  }

  async getPatientDashboard(patientId: string) {
    const [
      totalAppointments,
      upcomingAppointments,
      recentAppointments,
      recentPrescriptions,
      unreadNotifications,
    ] = await Promise.all([
      this.appointmentModel.countDocuments({ patientId }),
      this.appointmentModel
        .find({
          patientId,
          appointmentDate: { $gte: new Date() },
          status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        })
        .populate({
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ appointmentDate: 1 })
        .limit(5)
        .exec(),
      this.appointmentModel
        .find({ patientId })
        .populate({
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
      this.prescriptionModel
        .find({ patientId })
        .populate({
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
      this.notificationModel.countDocuments({ userId: patientId, isRead: false }),
    ]);

    // Get my doctors
    const myDoctors = await this.appointmentModel
      .distinct('doctorId', { patientId })
      .exec();

    const doctorsWithDetails = await Promise.all(
      myDoctors.map(async (doctorId) => {
        const doctor = await this.doctorModel.findById(doctorId).populate('userId').exec();
        return doctor;
      })
    );

    // Transform appointments to include appointmentType field for frontend compatibility
    const transformedUpcomingAppointments = upcomingAppointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    const transformedRecentAppointments = recentAppointments.map((appointment: any) => {
      const appointmentObj = appointment.toObject ? appointment.toObject() : appointment;
      return {
        ...appointmentObj,
        appointmentType: appointment.type,
      };
    });

    return {
      metrics: {
        totalAppointments,
        unreadNotifications,
      },
      upcomingAppointments: transformedUpcomingAppointments,
      recentAppointments: transformedRecentAppointments,
      recentPrescriptions,
      myDoctors: doctorsWithDetails.filter(doctor => doctor !== null),
    };
  }

  async getDashboardData(userId: string, role: string) {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return this.getAdminDashboard();
      
      case UserRole.DOCTOR:
        const doctor = await this.doctorModel.findOne({ userId }).exec();
        if (!doctor) throw new Error('Doctor profile not found');
        return this.getDoctorDashboard(doctor._id.toString());
      
      case UserRole.PATIENT:
        const patient = await this.patientModel.findOne({ userId }).exec();
        if (!patient) throw new Error('Patient profile not found');
        return this.getPatientDashboard(patient._id.toString());
      
      default:
        throw new Error('Invalid user role');
    }
  }

  async getQuickStats() {
    const [
      totalUsers,
      totalAppointments,
      totalPrescriptions,
    ] = await Promise.all([
      this.userModel.countDocuments({ isActive: true }),
      this.appointmentModel.countDocuments(),
      this.prescriptionModel.countDocuments(),
    ]);

    return {
      totalUsers,
      totalAppointments,
      totalPrescriptions,
    };
  }
}
