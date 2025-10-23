import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all patients (Admin/Doctor only)' })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('my-profile')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get current patient profile' })
  getMyProfile(@Request() req) {
    return this.patientsService.findByUserId(req.user.userId);
  }

  @Patch('my-profile')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update current patient profile' })
  updateMyProfile(@Request() req, @Body() updateData: any) {
    return this.patientsService.findByUserId(req.user.userId).then(patient => 
      this.patientsService.update(patient._id.toString(), updateData)
    );
  }

  @Patch('my-profile/medical-history')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update medical history' })
  updateMedicalHistory(@Request() req, @Body() body: { medicalHistory: string[] }) {
    return this.patientsService.findByUserId(req.user.userId).then(patient => 
      this.patientsService.updateMedicalHistory(patient._id.toString(), body.medicalHistory)
    );
  }

  @Patch('my-profile/allergies')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update allergies' })
  updateAllergies(@Request() req, @Body() body: { allergies: string[] }) {
    return this.patientsService.findByUserId(req.user.userId).then(patient => 
      this.patientsService.updateAllergies(patient._id.toString(), body.allergies)
    );
  }

  @Patch('my-profile/medications')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update current medications' })
  updateCurrentMedications(@Request() req, @Body() body: { currentMedications: string[] }) {
    return this.patientsService.findByUserId(req.user.userId).then(patient => 
      this.patientsService.updateCurrentMedications(patient._id.toString(), body.currentMedications)
    );
  }

  @Patch('my-profile/insurance')
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update insurance information' })
  updateInsuranceInfo(@Request() req, @Body() body: { insuranceInfo: any }) {
    return this.patientsService.findByUserId(req.user.userId).then(patient => 
      this.patientsService.updateInsuranceInfo(patient._id.toString(), body.insuranceInfo)
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get patient by ID (Admin/Doctor only)' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new patient (Admin only)' })
  create(@Body() createData: any) {
    return this.patientsService.create(createData);
  }

  @Patch(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update patient (Admin only)' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.patientsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete patient (Admin only)' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
