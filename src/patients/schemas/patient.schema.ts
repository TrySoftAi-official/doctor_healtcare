import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({
    type: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String }
    }
  })
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  @Prop()
  medicalHistory: string[];

  @Prop()
  allergies: string[];

  @Prop()
  currentMedications: string[];

  @Prop({
    type: {
      provider: { type: String },
      policyNumber: { type: String },
      groupNumber: { type: String }
    }
  })
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };

  @Prop()
  preferredLanguage: string;

  @Prop()
  notes: string;

  // Virtual property for populated user data (not stored in DB)
  user?: User;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
