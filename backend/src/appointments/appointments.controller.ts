import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, CancelAppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create new appointment',
    description: 'Book a new appointment with a doctor. Patient can book appointments for themselves.'
  })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Appointment created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        doctorId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        patientId: { type: 'string', example: '507f1f77bcf86cd799439013' },
        appointmentDate: { type: 'string', example: '2024-12-25' },
        startTime: { type: 'string', example: '09:00' },
        endTime: { type: 'string', example: '10:00' },
        type: { type: 'string', example: 'in-person' },
        status: { type: 'string', example: 'Pending' },
        problemDescription: { type: 'string', example: 'Regular checkup' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or doctor not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(createAppointmentDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all appointments',
    description: 'Retrieve appointments with optional filtering. Supports filtering by doctor, patient, status, type, and date range. Returns only appointments accessible to the current user based on their role.'
  })
  @ApiQuery({ name: 'doctorId', required: false, description: 'Filter by doctor ID', example: '507f1f77bcf86cd799439012' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID', example: '507f1f77bcf86cd799439013' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by appointment status', example: 'Confirmed' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by appointment type', example: 'in-person' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter from date (ISO format)', example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter to date (ISO format)', example: '2024-12-31' })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointments retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          doctorId: { type: 'string', example: '507f1f77bcf86cd799439012' },
          patientId: { type: 'string', example: '507f1f77bcf86cd799439013' },
          appointmentDate: { type: 'string', example: '2024-12-25' },
          startTime: { type: 'string', example: '09:00' },
          endTime: { type: 'string', example: '10:00' },
          type: { type: 'string', example: 'in-person' },
          status: { type: 'string', example: 'Confirmed' },
          problemDescription: { type: 'string', example: 'Regular checkup' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  findAll(@Query() filters: any, @Request() req) {
    return this.appointmentsService.findAll(filters, req.user.userId, req.user.role);
  }

  @Get('upcoming')
  @ApiOperation({ 
    summary: 'Get upcoming appointments',
    description: 'Get upcoming appointments for the current user (patient or doctor).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Upcoming appointments retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          doctorId: { type: 'string', example: '507f1f77bcf86cd799439012' },
          patientId: { type: 'string', example: '507f1f77bcf86cd799439013' },
          appointmentDate: { type: 'string', example: '2024-12-25' },
          startTime: { type: 'string', example: '09:00' },
          endTime: { type: 'string', example: '10:00' },
          type: { type: 'string', example: 'in-person' },
          status: { type: 'string', example: 'Confirmed' },
          problemDescription: { type: 'string', example: 'Regular checkup' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  getUpcoming(@Request() req) {
    return this.appointmentsService.getUpcomingAppointments(req.user.userId, req.user.role);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get appointments for a specific doctor' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have access to this doctor\'s appointments' })
  getDoctorAppointments(@Param('doctorId') doctorId: string, @Query() filters: any, @Request() req) {
    return this.appointmentsService.getDoctorAppointments(doctorId, filters, req.user.userId, req.user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get appointments for a specific patient' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have access to this patient\'s appointments' })
  getPatientAppointments(@Param('patientId') patientId: string, @Query() filters: any, @Request() req) {
    return this.appointmentsService.getPatientAppointments(patientId, filters, req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have access to this appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string, @Request() req): Promise<any> {
    return this.appointmentsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission to update this appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @Request() req): Promise<any> {
    return this.appointmentsService.update(id, updateAppointmentDto, req.user.userId, req.user.role);
  }

  @Put(':id/status')
  @ApiOperation({ 
    summary: 'Update appointment status',
    description: 'Update the status of an appointment. Valid statuses: Pending, Confirmed, Completed, Cancelled, No Show'
  })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({
    description: 'Status update request',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'],
          example: 'Confirmed'
        }
      },
      required: ['status']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointment status updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission to update this appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req): Promise<any> {
    return this.appointmentsService.updateStatus(id, body.status, req.user.userId, req.user.role);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  cancel(@Param('id') id: string, @Body() cancelAppointmentDto: CancelAppointmentDto, @Request() req): Promise<any> {
    return this.appointmentsService.cancel(id, cancelAppointmentDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete appointment (Admin only)' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
