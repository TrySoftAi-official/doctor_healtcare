import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserRole } from '../src/common/enums/user-role.enum';

async function seedUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create the user that's trying to authenticate
    const userData = {
      email: 'john.smith@email.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1-555-0301',
      role: UserRole.PATIENT,
    };

    try {
      const user = await authService.register(userData);
    } catch (error) {
      if (error.message.includes('already exists')) {
      } else {
        throw error;
      }
    }

    // Also create a doctor for testing
    const doctorData = {
      email: 'dr.sarah.ahmed@healthcare.com',
      password: 'password123',
      firstName: 'Dr. Sarah',
      lastName: 'Ahmed',
      phone: '+1-555-0201',
      role: UserRole.DOCTOR,
      specialty: 'Cardiology',
      licenseNumber: 'MD123456',
    };

    try {
      const doctor = await authService.register(doctorData);
    } catch (error) {
      if (error.message.includes('already exists')) {
      } else {
        throw error;
      }
    }

  } catch (error) {
  } finally {
    await app.close();
  }
}

seedUser();
