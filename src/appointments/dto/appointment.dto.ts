import { IsDateString, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType } from '../../common/enums/appointment-type.enum';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Doctor ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  doctorId: string;

  @ApiProperty({
    description: 'Appointment date in ISO format',
    example: '2024-12-25',
    format: 'date'
  })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({
    description: 'Appointment start time in HH:MM format',
    example: '09:00'
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'Appointment end time in HH:MM format',
    example: '10:00'
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Type of appointment',
    enum: AppointmentType,
    example: AppointmentType.IN_PERSON
  })
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @ApiPropertyOptional({
    description: 'Description of the medical problem or reason for appointment',
    example: 'Regular checkup and blood pressure monitoring'
  })
  @IsOptional()
  @IsString()
  problemDescription?: string;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Updated appointment date in ISO format',
    example: '2024-12-26',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @ApiPropertyOptional({
    description: 'Updated start time in HH:MM format',
    example: '10:00'
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Updated end time in HH:MM format',
    example: '11:00'
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Updated appointment type',
    enum: AppointmentType,
    example: AppointmentType.ONLINE
  })
  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;

  @ApiPropertyOptional({
    description: 'Updated appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Updated problem description',
    example: 'Follow-up for diabetes management'
  })
  @IsOptional()
  @IsString()
  problemDescription?: string;

  @ApiPropertyOptional({
    description: 'Doctor notes about the appointment',
    example: 'Patient showed good progress, continue current medication'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Medical diagnosis',
    example: 'Type 2 Diabetes, well controlled'
  })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({
    description: 'Recommended treatment plan',
    example: 'Continue metformin, lifestyle modifications'
  })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Follow-up appointment date',
    example: '2025-01-25',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @ApiPropertyOptional({
    description: 'Video consultation meeting link',
    example: 'https://meet.healthcare.com/abc123'
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;
}

export class CancelAppointmentDto {
  @ApiProperty({
    description: 'Reason for appointment cancellation',
    example: 'Patient requested to reschedule due to emergency'
  })
  @IsString()
  cancellationReason: string;
}
