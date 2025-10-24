import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}
