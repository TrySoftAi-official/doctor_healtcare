import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../src/users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../src/doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../src/patients/schemas/patient.schema';
import { Prescription, PrescriptionDocument } from '../src/prescriptions/schemas/prescription.schema';
import { Appointment, AppointmentDocument } from '../src/appointments/schemas/appointment.schema';
import { UserRole } from '../src/common/enums/user-role.enum';
import { AppointmentStatus } from '../src/common/enums/appointment-status.enum';
import { AppointmentType } from '../src/common/enums/appointment-type.enum';

async function seedPrescriptions() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const doctorModel = app.get<Model<DoctorDocument>>(getModelToken(Doctor.name));
  const patientModel = app.get<Model<PatientDocument>>(getModelToken(Patient.name));
  const prescriptionModel = app.get<Model<PrescriptionDocument>>(getModelToken(Prescription.name));
  const appointmentModel = app.get<Model<AppointmentDocument>>(getModelToken(Appointment.name));

  try {
    console.log('Starting prescription seeding...');

    // Find existing users (keeping them as requested)
    const existingUsers = await userModel.find({});
    console.log(`Found ${existingUsers.length} existing users`);

    // Find or create doctor and patient profiles
    let doctor = await doctorModel.findOne({});
    let patient = await patientModel.findOne({});

    if (!doctor) {
      // Find doctor user
      const doctorUser = await userModel.findOne({ role: UserRole.DOCTOR });
      if (doctorUser) {
        doctor = await doctorModel.create({
          userId: doctorUser._id,
          specialty: 'General Medicine',
          licenseNumber: 'MD123456',
          isAvailable: true,
          experience: 5,
          education: 'MBBS, MD',
          bio: 'Experienced general practitioner'
        });
        console.log('Created doctor profile');
      }
    }

    if (!patient) {
      // Find patient user
      const patientUser = await userModel.findOne({ role: UserRole.PATIENT });
      if (patientUser) {
        patient = await patientModel.create({
          userId: patientUser._id,
          medicalHistory: ['Hypertension', 'Diabetes'],
          allergies: ['Penicillin', 'Sulfa drugs'],
          emergencyContact: {
            name: 'Emergency Contact',
            phone: '123-456-7890',
            relationship: 'Family'
          }
        });
        console.log('Created patient profile');
      }
    }

    if (!doctor || !patient) {
      console.log('Doctor or patient profile not found. Please ensure users exist first.');
      return;
    }

    // Create some appointments first (if they don't exist)
    let appointment = await appointmentModel.findOne({});
    if (!appointment) {
      appointment = await appointmentModel.create({
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentDate: new Date('2024-12-25'),
        startTime: '09:00',
        endTime: '10:00',
        type: AppointmentType.IN_PERSON,
        status: AppointmentStatus.COMPLETED,
        problemDescription: 'Regular checkup and prescription review'
      });
      console.log('Created appointment');
    }

    // Clear existing prescriptions (optional - remove this line if you want to keep existing prescriptions)
    await prescriptionModel.deleteMany({});
    console.log('Cleared existing prescriptions');

    // Create sample prescriptions
    const prescriptions = [
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        medications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with food to reduce stomach upset'
          },
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take at the same time each day'
          }
        ],
        notes: 'Patient has diabetes and hypertension. Monitor blood sugar and blood pressure regularly.',
        isDispensed: false,
        isRefillable: true,
        refillCount: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        medications: [
          {
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with or without food. Complete the full course even if feeling better.'
          }
        ],
        notes: 'Prescribed for bacterial infection. Patient has no known allergies to penicillin.',
        isDispensed: true,
        dispensedAt: new Date(),
        dispensedBy: doctor._id,
        isRefillable: false,
        refillCount: 0,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Every 6-8 hours as needed',
            duration: '10 days',
            instructions: 'Take with food. Do not exceed 2400mg per day.'
          },
          {
            name: 'Acetaminophen',
            dosage: '500mg',
            frequency: 'Every 4-6 hours as needed',
            duration: '10 days',
            instructions: 'For pain relief. Do not exceed 4000mg per day.'
          }
        ],
        notes: 'Pain management for post-surgical recovery. Monitor for any adverse reactions.',
        isDispensed: false,
        isRefillable: true,
        refillCount: 1,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        medications: [
          {
            name: 'Omeprazole',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '14 days',
            instructions: 'Take before breakfast on an empty stomach'
          }
        ],
        notes: 'For acid reflux management. Patient should avoid spicy foods and large meals.',
        isDispensed: true,
        dispensedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        dispensedBy: doctor._id,
        isRefillable: true,
        refillCount: 0,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      {
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        medications: [
          {
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the evening with or without food'
          },
          {
            name: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take with food to prevent stomach irritation'
          }
        ],
        notes: 'Cardiovascular protection. Patient has high cholesterol and family history of heart disease.',
        isDispensed: false,
        isRefillable: true,
        refillCount: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    ];

    // Insert prescriptions
    const createdPrescriptions = await prescriptionModel.insertMany(prescriptions);
    console.log(`Successfully created ${createdPrescriptions.length} prescriptions`);

    // Display created prescriptions
    console.log('\nCreated prescriptions:');
    for (const prescription of createdPrescriptions) {
      console.log(`- Prescription ID: ${prescription._id}`);
      console.log(`  Medications: ${prescription.medications.map(m => m.name).join(', ')}`);
      console.log(`  Status: ${prescription.isDispensed ? 'Dispensed' : 'Pending'}`);
      console.log(`  Refillable: ${prescription.isRefillable ? 'Yes' : 'No'}`);
      console.log('');
    }

    console.log('Prescription seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding prescriptions:', error);
  } finally {
    await app.close();
  }
}

seedPrescriptions();
