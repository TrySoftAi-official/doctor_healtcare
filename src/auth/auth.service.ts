import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string, role: UserRole): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email, role, isActive: true }).exec();
      if (user && await bcrypt.compare(password, user.password)) {
        const { password: _, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      console.error('validateUser error:', error);
      throw error;
    }
  }

  async validateUserByEmail(email: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email, isActive: true }).exec();
      if (user && await bcrypt.compare(password, user.password)) {
        const { password: _, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      console.error('validateUserByEmail error:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password, loginDto.role);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      const payload = { email: user.email, sub: user._id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async loginByEmail(email: string, password: string) {
    try {
      const user = await this.validateUserByEmail(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      const payload = { email: user.email, sub: user._id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login by email error:', error);
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: registerDto.email }).exec();
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Validate doctor-specific fields
      if (registerDto.role === UserRole.DOCTOR) {
        if (!registerDto.specialty || !registerDto.licenseNumber) {
          throw new BadRequestException('Specialty and license number are required for doctor registration');
        }
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const user = new this.userModel({
        ...registerDto,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      // Create role-specific profile
      if (registerDto.role === UserRole.DOCTOR) {
        const doctor = new this.doctorModel({
          userId: savedUser._id,
          specialty: registerDto.specialty,
          licenseNumber: registerDto.licenseNumber,
          rating: 0,
          totalReviews: 0,
          isAvailable: true,
        });
        await doctor.save();
      } else if (registerDto.role === UserRole.PATIENT) {
        const patient = new this.patientModel({
          userId: savedUser._id,
        });
        await patient.save();
      }

      const payload = { email: savedUser.email, sub: savedUser._id, role: savedUser.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          profileImage: savedUser.profileImage,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: forgotPasswordDto.email }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    // TODO: Send email with reset token
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    return { message: 'Password reset instructions sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetPasswordToken: resetPasswordDto.token,
      resetPasswordExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 12);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let profile = null;
    if (user.role === UserRole.DOCTOR) {
      profile = await this.doctorModel.findOne({ userId }).exec();
    } else if (user.role === UserRole.PATIENT) {
      profile = await this.patientModel.findOne({ userId }).exec();
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
    };
  }
}
