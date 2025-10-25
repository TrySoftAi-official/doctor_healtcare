import { IsString, IsEnum, IsOptional, IsMongoId, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../schemas/message.schema';

export class SendMessageDto {
  @ApiProperty({
    description: 'Receiver user ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  receiverId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you feeling today?'
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Type of message',
    enum: MessageType,
    example: MessageType.TEXT,
    default: MessageType.TEXT
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({
    description: 'File URL for file/image messages',
    example: 'https://example.com/file.pdf'
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({
    description: 'File name for file/image messages',
    example: 'medical_report.pdf'
  })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1024000
  })
  @IsOptional()
  fileSize?: number;
}

export class MarkAsReadDto {
  @ApiProperty({
    description: 'Message ID to mark as read',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  messageId: string;
}

export class GetChatHistoryDto {
  @ApiProperty({
    description: 'Other participant user ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  participantId: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of messages per page',
    example: 50,
    default: 50
  })
  @IsOptional()
  limit?: number;
}
