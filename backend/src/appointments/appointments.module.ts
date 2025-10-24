import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
