import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId: Types.ObjectId;

  @Prop({ required: true })
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];

  @Prop()
  notes: string;

  @Prop({ default: false })
  isDispensed: boolean;

  @Prop()
  dispensedAt: Date;

  @Prop()
  dispensedBy: Types.ObjectId;

  @Prop({ default: false })
  isRefillable: boolean;

  @Prop({ default: 0 })
  refillCount: number;

  @Prop()
  expiryDate: Date;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
