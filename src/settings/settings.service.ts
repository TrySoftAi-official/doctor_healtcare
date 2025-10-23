import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async getProfileSettings(userId: string, role: string) {
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = null;
    if (role === UserRole.DOCTOR) {
      profile = await this.doctorModel.findOne({ userId }).exec();
    } else if (role === UserRole.PATIENT) {
      profile = await this.patientModel.findOne({ userId }).exec();
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
    };
  }

  async updateProfileSettings(userId: string, role: string, updateData: any) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData.user, { new: true }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = null;
    if (role === UserRole.DOCTOR && updateData.profile) {
      profile = await this.doctorModel.findOneAndUpdate({ userId }, updateData.profile, { new: true }).exec();
    } else if (role === UserRole.PATIENT && updateData.profile) {
      profile = await this.patientModel.findOneAndUpdate({ userId }, updateData.profile, { new: true }).exec();
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
    };
  }

  async updateNotificationPreferences(userId: string, preferences: any) {
    // This would typically be stored in a separate settings collection
    // For now, we'll store it in the user document
    return this.userModel.findByIdAndUpdate(
      userId,
      { notificationPreferences: preferences },
      { new: true }
    ).select('-password').exec();
  }

  async updatePrivacySettings(userId: string, settings: any) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { privacySettings: settings },
      { new: true }
    ).select('-password').exec();
  }

  async updateDoctorSettings(userId: string, settings: any) {
    const doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.doctorModel.findByIdAndUpdate(doctor._id, settings, { new: true }).exec();
  }

  async updatePatientSettings(userId: string, settings: any) {
    const patient = await this.patientModel.findOne({ userId }).exec();
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.patientModel.findByIdAndUpdate(patient._id, settings, { new: true }).exec();
  }

  async getSystemSettings() {
    // This would typically come from a system settings collection
    return {
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      systemAnnouncement: null,
    };
  }

  async updateSystemSettings(settings: any) {
    // This would typically update a system settings collection
    // For now, we'll just return the settings
    return settings;
  }
}
