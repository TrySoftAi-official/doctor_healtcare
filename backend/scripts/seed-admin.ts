import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserRole } from '../src/common/enums/user-role.enum';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create administrator user
    const adminData = {
      email: 'bainf014@gmail.com',
      password: '1214BK',
      firstName: 'Administrator',
      lastName: 'User',
      phone: '+1-555-0000',
      role: UserRole.ADMINISTRATOR,
    };

    try {
      const admin = await authService.register(adminData);
      console.log('✅ Administrator user created successfully!');
      console.log('📧 Email:', admin.user.email);
      console.log('👤 Role:', admin.user.role);
      console.log('🆔 ID:', admin.user.id);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Administrator user already exists');
        console.log('📧 Email: bainf014@gmail.com');
      } else {
        console.error('❌ Error creating administrator:', error.message);
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

seedAdmin();

