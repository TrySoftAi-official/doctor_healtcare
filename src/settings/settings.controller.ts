import { Controller, Get, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get profile settings' })
  getProfileSettings(@Request() req) {
    return this.settingsService.getProfileSettings(req.user.userId, req.user.role);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile settings' })
  updateProfileSettings(@Request() req, @Body() updateData: any) {
    return this.settingsService.updateProfileSettings(req.user.userId, req.user.role, updateData);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateNotificationPreferences(@Request() req, @Body() preferences: any) {
    return this.settingsService.updateNotificationPreferences(req.user.userId, preferences);
  }

  @Patch('privacy')
  @ApiOperation({ summary: 'Update privacy settings' })
  updatePrivacySettings(@Request() req, @Body() settings: any) {
    return this.settingsService.updatePrivacySettings(req.user.userId, settings);
  }

  @Patch('doctor')
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update doctor settings (Doctor only)' })
  updateDoctorSettings(@Request() req, @Body() settings: any) {
    return this.settingsService.updateDoctorSettings(req.user.userId, settings);
  }

  @Patch('patient')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update patient settings (Patient only)' })
  updatePatientSettings(@Request() req, @Body() settings: any) {
    return this.settingsService.updatePatientSettings(req.user.userId, settings);
  }

  @Get('system')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get system settings (Admin only)' })
  getSystemSettings() {
    return this.settingsService.getSystemSettings();
  }

  @Patch('system')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update system settings (Admin only)' })
  updateSystemSettings(@Body() settings: any) {
    return this.settingsService.updateSystemSettings(settings);
  }
}
