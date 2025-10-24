import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create prescription (Doctor only)' })
  create(@Body() createPrescriptionDto: any, @Request() req) {
    return this.prescriptionsService.create(createPrescriptionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prescriptions' })
  findAll(@Query() filters: any) {
    return this.prescriptionsService.findAll(filters);
  }

  @Get('my-prescriptions')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get current patient prescriptions' })
  getMyPrescriptions(@Request() req) {
    return this.prescriptionsService.getPatientPrescriptions(req.user.userId);
  }

  @Get('my-prescriptions/recent')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get recent prescriptions' })
  getRecentPrescriptions(@Request() req, @Query('limit') limit: number = 5) {
    return this.prescriptionsService.getRecentPrescriptions(req.user.userId, limit);
  }

  @Get('doctor-prescriptions')
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get doctor prescriptions' })
  getDoctorPrescriptions(@Request() req) {
    return this.prescriptionsService.getDoctorPrescriptions(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update prescription (Doctor only)' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.prescriptionsService.update(id, updateData);
  }

  @Patch(':id/dispense')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Dispense prescription (Admin only)' })
  dispense(@Param('id') id: string, @Request() req) {
    return this.prescriptionsService.dispense(id, req.user.userId);
  }

  @Patch(':id/refill')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Refill prescription (Patient only)' })
  refill(@Param('id') id: string) {
    return this.prescriptionsService.refill(id);
  }
}
