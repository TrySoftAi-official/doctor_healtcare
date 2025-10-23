import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  specialty: string;

  @Prop()
  licenseNumber: string;

  @Prop()
  experience: number;

  @Prop()
  education: string[];

  @Prop()
  certifications: string[];

  @Prop()
  languages: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop()
  bio: string;

  @Prop()
  consultationFee: number;

  @Prop({
    type: {
      monday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      tuesday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      wednesday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      thursday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      friday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      saturday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      },
      sunday: {
        start: { type: String },
        end: { type: String },
        isAvailable: { type: Boolean }
      }
    }
  })
  availability: {
    monday: { start: string; end: string; isAvailable: boolean };
    tuesday: { start: string; end: string; isAvailable: boolean };
    wednesday: { start: string; end: string; isAvailable: boolean };
    thursday: { start: string; end: string; isAvailable: boolean };
    friday: { start: string; end: string; isAvailable: boolean };
    saturday: { start: string; end: string; isAvailable: boolean };
    sunday: { start: string; end: string; isAvailable: boolean };
  };

  @Prop({ default: true })
  isAvailable: boolean;

  // Virtual property for populated user data (not stored in DB)
  user?: User;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
