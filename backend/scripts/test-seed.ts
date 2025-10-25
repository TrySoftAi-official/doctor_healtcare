import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../src/users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../src/doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../src/patients/schemas/patient.schema';
import { Appointment, AppointmentDocument } from '../src/appointments/schemas/appointment.schema';
import { UserRole } from '../src/common/enums/user-role.enum';
import { AppointmentStatus } from '../src/common/enums/appointment-status.enum';
import { AppointmentType } from '../src/common/enums/appointment-type.enum';

async function seedTestData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const doctorModel = app.get<Model<DoctorDocument>>(getModelToken(Doctor.name));
  const patientModel = app.get<Model<PatientDocument>>(getModelToken(Patient.name));
  const appointmentModel = app.get<Model<AppointmentDocument>>(getModelToken(Appointment.name));

  try {
    // Clear existing data
    await appointmentModel.deleteMany({});
    await patientModel.deleteMany({});
    await doctorModel.deleteMany({});
    await userModel.deleteMany({});

    // Create test users
    const adminUser = await userModel.create({
      email: 'admin@test.com',
      password: '$2b$10$example', // This would be hashed in real scenario
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMINISTRATOR,
      isActive: true,
      isEmailVerified: true
    });

    const doctorUser = await userModel.create({
      email: 'doctor@test.com',
      password: '$2b$10$example',
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: UserRole.DOCTOR,
      isActive: true,
      isEmailVerified: true
    });

    const patientUser = await userModel.create({
      email: 'patient@test.com',
      password: '$2b$10$example',
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.PATIENT,
      isActive: true,
      isEmailVerified: true
    });

    // Create doctor profile
    const doctor = await doctorModel.create({
      userId: doctorUser._id,
      specialty: 'General Medicine',
      isAvailable: true
    });

    // Create patient profile
    const patient = await patientModel.create({
      userId: patientUser._id,
      medicalHistory: ['Hypertension'],
      allergies: ['Penicillin']
    });

    // Create test appointments
    const appointment1 = await appointmentModel.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: new Date('2024-12-25'),
      startTime: '09:00',
      endTime: '10:00',
      type: AppointmentType.IN_PERSON,
      status: AppointmentStatus.CONFIRMED,
      problemDescription: 'Regular checkup'
    });

    const appointment2 = await appointmentModel.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: new Date('2024-12-26'),
      startTime: '14:00',
      endTime: '15:00',
      type: AppointmentType.ONLINE,
      status: AppointmentStatus.PENDING,
      problemDescription: 'Follow-up consultation'
    });


  } catch (error) {
  } finally {
    await app.close();
  }
}

seedTestData();
