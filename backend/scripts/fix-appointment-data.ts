import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AppointmentsService } from '../src/appointments/appointments.service';
import { UsersService } from '../src/users/users.service';
import { PatientsService } from '../src/patients/patients.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Appointment } from '../src/appointments/schemas/appointment.schema';
import { User } from '../src/users/schemas/user.schema';
import { Patient } from '../src/patients/schemas/patient.schema';

async function fixAppointmentData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const appointmentModel = app.get<Model<Appointment>>(getModelToken(Appointment.name));
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const patientModel = app.get<Model<Patient>>(getModelToken(Patient.name));
  
  try {
    console.log('🔍 Checking appointments with null patientId...');
    
    // Find appointments with null patientId
    const appointmentsWithNullPatient = await appointmentModel.find({ patientId: null }).exec();
    console.log(`Found ${appointmentsWithNullPatient.length} appointments with null patientId`);
    
    for (const appointment of appointmentsWithNullPatient) {
      console.log(`\n📋 Processing appointment: ${appointment._id}`);
      console.log(`   Date: ${appointment.appointmentDate}`);
      console.log(`   Doctor: ${appointment.doctorId}`);
      console.log(`   Problem: ${appointment.problemDescription}`);
      
      // Try to find a user based on the problem description or other clues
      let userToAssign = null;
      
      // Check if the problem description contains an email
      const emailMatch = appointment.problemDescription?.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        const email = emailMatch[1];
        console.log(`   Found email in problem description: ${email}`);
        userToAssign = await userModel.findOne({ email }).exec();
      }
      
      // If no user found by email, try to find any user with role 'Patient'
      if (!userToAssign) {
        console.log('   No user found by email, looking for any patient user...');
        userToAssign = await userModel.findOne({ role: 'Patient' }).exec();
      }
      
      if (userToAssign) {
        console.log(`   Found user: ${userToAssign.email} (${userToAssign.firstName} ${userToAssign.lastName})`);
        
        // Check if patient profile exists
        let patient = await patientModel.findOne({ userId: userToAssign._id }).exec();
        
        if (!patient) {
          console.log('   Creating patient profile...');
          patient = new patientModel({
            userId: userToAssign._id,
            emergencyContact: {
              name: '',
              relationship: '',
              phone: ''
            }
          });
          await patient.save();
          console.log('   ✅ Patient profile created');
        } else {
          console.log('   ✅ Patient profile already exists');
        }
        
        // Update the appointment with the patient ID
        appointment.patientId = patient._id;
        await appointment.save();
        console.log(`   ✅ Updated appointment with patientId: ${patient._id}`);
        
      } else {
        console.log('   ❌ No suitable user found to assign to this appointment');
      }
    }
    
    console.log('\n🎉 Appointment data fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing appointment data:', error);
  } finally {
    await app.close();
  }
}

// Run the script
fixAppointmentData().catch(console.error);
