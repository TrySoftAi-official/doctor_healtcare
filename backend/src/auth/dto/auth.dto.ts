import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'doctor@healthcare.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.DOCTOR
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@healthcare.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe'
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PATIENT
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Medical specialty (required for doctors)',
    example: 'Cardiology'
  })
  @ValidateIf((o) => o.role === UserRole.DOCTOR)
  @IsString()
  specialty?: string; // For doctors

  @ApiPropertyOptional({
    description: 'Medical license number (required for doctors)',
    example: 'MD123456'
  })
  @ValidateIf((o) => o.role === UserRole.DOCTOR)
  @IsString()
  licenseNumber?: string; // For doctors
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address for password reset',
    example: 'user@healthcare.com',
    format: 'email'
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'newSecurePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123'
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newSecurePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
