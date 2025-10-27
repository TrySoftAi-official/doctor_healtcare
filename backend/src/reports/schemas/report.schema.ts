import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['PDF', 'Excel', 'CSV'] })
  type: string;

  @Prop({ required: true })
  reportType: string;

  @Prop({
    type: {
      start: { type: String },
      end: { type: String }
    }
  })
  dateRange?: {
    start: string;
    end: string;
  };

  @Prop({ required: true })
  filePath: string;

  @Prop({ default: 0 })
  fileSize: number;

  @Prop({ required: true, enum: ['Generating', 'Generated', 'Failed'], default: 'Generating' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  errorMessage?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
