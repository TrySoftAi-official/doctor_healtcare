import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { AppointmentType } from '../../common/enums/appointment-type.enum';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ type: String, enum: AppointmentType, required: true })
  type: AppointmentType;

  @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Prop()
  problemDescription: string;

  @Prop()
  notes: string;

  @Prop()
  diagnosis: string;

  @Prop()
  treatment: string;

  @Prop()
  followUpDate: Date;

  @Prop()
  meetingLink: string;

  @Prop()
  cancellationReason: string;

  @Prop()
  cancelledBy: Types.ObjectId;

  @Prop()
  cancelledAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
