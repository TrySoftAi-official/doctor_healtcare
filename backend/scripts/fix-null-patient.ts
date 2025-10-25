import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Appointment } from '../src/appointments/schemas/appointment.schema';
import { User } from '../src/users/schemas/user.schema';
import { Patient } from '../src/patients/schemas/patient.schema';

async function fixNullPatient() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const appointmentModel = app.get<Model<Appointment>>(getModelToken(Appointment.name));
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const patientModel = app.get<Model<Patient>>(getModelToken(Patient.name));
  
  try {
    console.log('🔍 Finding appointment with null patientId...');
    
    // Find the specific appointment
    const appointment = await appointmentModel.findById('68fca83c973af0aeb558dd9b').exec();
    
    if (!appointment) {
      console.log('❌ Appointment not found');
      return;
    }
    
    console.log('📋 Appointment details:');
    console.log(`   ID: ${appointment._id}`);
    console.log(`   PatientId: ${appointment.patientId}`);
    console.log(`   DoctorId: ${appointment.doctorId}`);
    console.log(`   Problem: ${appointment.problemDescription}`);
    
    // Extract email from problem description
    const emailMatch = appointment.problemDescription?.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const email = emailMatch ? emailMatch[1] : null;
    
    console.log(`📧 Extracted email: ${email}`);
    
    if (email) {
      // Find user by email
      const user = await userModel.findOne({ email }).exec();
      
      if (user) {
        console.log(`👤 Found user: ${user.firstName} ${user.lastName} (${user.email})`);
        
        // Check if patient profile exists
        let patient = await patientModel.findOne({ userId: user._id }).exec();
        
        if (!patient) {
          console.log('🏥 Creating patient profile...');
          patient = new patientModel({
            userId: user._id,
            emergencyContact: {
              name: '',
              relationship: '',
              phone: ''
            }
          });
          await patient.save();
          console.log(`✅ Patient profile created with ID: ${patient._id}`);
        } else {
          console.log(`✅ Patient profile already exists with ID: ${patient._id}`);
        }
        
        // Update the appointment
        appointment.patientId = patient._id;
        await appointment.save();
        console.log(`✅ Updated appointment with patientId: ${patient._id}`);
        
        // Verify the fix
        const updatedAppointment = await appointmentModel.findById(appointment._id).populate('patientId').exec();
        console.log('🔍 Verification:');
        console.log(`   Updated PatientId: ${updatedAppointment.patientId}`);
        
      } else {
        console.log('❌ User not found with email:', email);
      }
    } else {
      console.log('❌ No email found in problem description');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

// Run the script
fixNullPatient().catch(console.error);
