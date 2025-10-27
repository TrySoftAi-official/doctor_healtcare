import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Response } from 'express';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async getReports(@Request() req) {
    return this.reportsService.getReports(req.user.userId, req.user.role);
  }

  @Post('generate')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate a new report' })
  async generateReport(@Request() req, @Body() generateReportDto: any) {
    return this.reportsService.generateReport(req.user.userId, generateReportDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  async getReport(@Param('id') id: string, @Request() req) {
    return this.reportsService.getReport(id, req.user.userId, req.user.role);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download report file' })
  async downloadReport(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const report = await this.reportsService.getReport(id, req.user.userId, req.user.role);
    const fileBuffer = await this.reportsService.getReportFile(id);
    
    res.set({
      'Content-Type': report.type === 'PDF' ? 'application/pdf' : 
                     report.type === 'Excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                     'text/csv',
      'Content-Disposition': `attachment; filename="${report.name}.${report.type.toLowerCase()}"`,
      'Content-Length': fileBuffer.length.toString(),
    });
    
    res.send(fileBuffer);
  }

  @Get(':id/view')
  @ApiOperation({ summary: 'View report content' })
  async viewReport(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const report = await this.reportsService.getReport(id, req.user.userId, req.user.role);
    const fileBuffer = await this.reportsService.getReportFile(id);
    
    res.set({
      'Content-Type': report.type === 'PDF' ? 'application/pdf' : 
                     report.type === 'Excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                     'text/csv',
      'Content-Disposition': `inline; filename="${report.name}.${report.type.toLowerCase()}"`,
      'Content-Length': fileBuffer.length.toString(),
    });
    
    res.send(fileBuffer);
  }

  @Post(':id/regenerate')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Regenerate an existing report' })
  async regenerateReport(@Param('id') id: string, @Request() req) {
    return this.reportsService.regenerateReport(id, req.user.userId);
  }
}
