import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data based on user role' })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.userId, req.user.role);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get quick statistics' })
  getQuickStats() {
    return this.dashboardService.getQuickStats();
  }

  @Get('analytics/appointments')
  @ApiOperation({ summary: 'Get appointment analytics' })
  getAppointmentAnalytics(@Query('start') start?: string, @Query('end') end?: string) {
    return this.dashboardService.getAppointmentAnalytics(start, end);
  }

  @Get('analytics/users')
  @ApiOperation({ summary: 'Get user analytics' })
  getUserAnalytics(@Query('start') start?: string, @Query('end') end?: string) {
    return this.dashboardService.getUserAnalytics(start, end);
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenueAnalytics(@Query('start') start?: string, @Query('end') end?: string) {
    return this.dashboardService.getRevenueAnalytics(start, end);
  }

  @Get('analytics/system')
  @ApiOperation({ summary: 'Get system performance analytics' })
  getSystemAnalytics() {
    return this.dashboardService.getSystemAnalytics();
  }
}
