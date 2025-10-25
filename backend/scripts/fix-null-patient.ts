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
    
    // Find the specific appointment
    const appointment = await appointmentModel.findById('68fca83c973af0aeb558dd9b').exec();
    
    if (!appointment) {
      return;
    }
    
    
    // Extract email from problem description
    const emailMatch = appointment.problemDescription?.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const email = emailMatch ? emailMatch[1] : null;
    
    
    if (email) {
      // Find user by email
      const user = await userModel.findOne({ email }).exec();
      
      if (user) {
        
        // Check if patient profile exists
        let patient = await patientModel.findOne({ userId: user._id }).exec();
        
        if (!patient) {
          patient = new patientModel({
            userId: user._id,
            emergencyContact: {
              name: '',
              relationship: '',
              phone: ''
            }
          });
          await patient.save();
        } else {
        }
        
        // Update the appointment
        appointment.patientId = patient._id;
        await appointment.save();
        
        // Verify the fix
        const updatedAppointment = await appointmentModel.findById(appointment._id).populate('patientId').exec();
        
      } else {
      }
    } else {
    }
    
  } catch (error) {
  } finally {
    await app.close();
  }
}

// Run the script
fixNullPatient().catch(console.error);
