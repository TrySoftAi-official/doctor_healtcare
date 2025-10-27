import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { UserRole } from '../common/enums/user-role.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class ReportsService {
  private readonly reportsDir = path.join(process.cwd(), 'reports');

  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private dashboardService: DashboardService,
  ) {
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async getReports(userId: string, userRole: string) {
    const query: any = {};
    
    // Non-administrators can only see their own reports
    if (userRole !== UserRole.ADMINISTRATOR) {
      query.createdBy = userId;
    }

    const reports = await this.reportModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    return reports.map((report: any) => ({
      id: report._id.toString(),
      name: report.name,
      type: report.type,
      size: this.formatFileSize(report.fileSize),
      date: (report as any).createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      status: report.status,
      downloadUrl: `/reports/${report._id}/download`,
      viewUrl: `/reports/${report._id}/view`
    }));
  }

  async generateReport(userId: string, generateReportDto: any) {
    const { type, reportType, dateRange } = generateReportDto;
    
    const reportName = this.generateReportName(reportType, dateRange);
    const fileName = `${Date.now()}-${reportName}.${type.toLowerCase()}`;
    const filePath = path.join(this.reportsDir, fileName);

    // Create report record
    const report = new this.reportModel({
      name: reportName,
      type: type.toUpperCase(),
      reportType,
      dateRange,
      filePath,
      fileSize: 0,
      status: 'Generating',
      createdBy: userId,
    });

    await report.save();

    try {
      // Generate the actual report file
      let fileBuffer: Buffer;
      
      switch (type.toUpperCase()) {
        case 'PDF':
          fileBuffer = await this.generatePDFReport(reportType, dateRange);
          break;
        case 'EXCEL':
          fileBuffer = await this.generateExcelReport(reportType, dateRange);
          break;
        case 'CSV':
          fileBuffer = await this.generateCSVReport(reportType, dateRange);
          break;
        default:
          throw new Error('Unsupported report type');
      }

      // Save file to disk
      fs.writeFileSync(filePath, fileBuffer);
      
      // Update report record
      report.fileSize = fileBuffer.length;
      report.status = 'Generated';
      await report.save();

      return {
        id: report._id.toString(),
        name: report.name,
        type: report.type,
        size: this.formatFileSize(report.fileSize),
        date: (report as any).createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        status: report.status,
        downloadUrl: `/reports/${report._id}/download`,
        viewUrl: `/reports/${report._id}/view`
      };
    } catch (error) {
      report.status = 'Failed';
      await report.save();
      throw error;
    }
  }

  async getReport(id: string, userId: string, userRole: string) {
    const report = await this.reportModel.findById(id).exec();
    
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Check permissions
    if (userRole !== UserRole.ADMINISTRATOR && report.createdBy.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: report._id.toString(),
      name: report.name,
      type: report.type,
      size: this.formatFileSize(report.fileSize),
      date: (report as any).createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      status: report.status,
      downloadUrl: `/reports/${report._id}/download`,
      viewUrl: `/reports/${report._id}/view`
    };
  }

  async getReportFile(id: string): Promise<Buffer> {
    const report = await this.reportModel.findById(id).exec();
    
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (!fs.existsSync(report.filePath)) {
      throw new NotFoundException('Report file not found');
    }

    return fs.readFileSync(report.filePath);
  }

  async regenerateReport(id: string, userId: string) {
    const report = await this.reportModel.findById(id).exec();
    
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Delete old file if exists
    if (fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    // Generate new report
    return this.generateReport(userId, {
      type: report.type,
      reportType: report.reportType,
      dateRange: report.dateRange
    });
  }

  private generateReportName(reportType: string, dateRange: any): string {
    const dateStr = dateRange ? 
      `${dateRange.start}_to_${dateRange.end}` : 
      new Date().toISOString().split('T')[0];
    
    return `${reportType}_${dateStr}`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private async generatePDFReport(reportType: string, dateRange: any): Promise<Buffer> {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.on('error', reject);

      // Add content based on report type
      doc.fontSize(20).text(`${reportType} Report`, 100, 100);
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 100, 150);
      
      if (dateRange) {
        doc.text(`Date Range: ${dateRange.start} to ${dateRange.end}`, 100, 180);
      }

      // Add report-specific content
      this.addPDFContent(doc, reportType, dateRange);

      doc.end();
    });
  }

  private async generateExcelReport(reportType: string, dateRange: any): Promise<Buffer> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${reportType} Report`);

    // Add headers
    worksheet.addRow(['Report Type', reportType]);
    worksheet.addRow(['Generated Date', new Date().toLocaleDateString()]);
    if (dateRange) {
      worksheet.addRow(['Date Range', `${dateRange.start} to ${dateRange.end}`]);
    }
    worksheet.addRow([]); // Empty row

    // Add report-specific data
    await this.addExcelContent(worksheet, reportType, dateRange);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async generateCSVReport(reportType: string, dateRange: any): Promise<Buffer> {
    let csvContent = `Report Type,${reportType}\n`;
    csvContent += `Generated Date,${new Date().toLocaleDateString()}\n`;
    
    if (dateRange) {
      csvContent += `Date Range,${dateRange.start} to ${dateRange.end}\n`;
    }
    
    csvContent += '\n'; // Empty row

    // Add report-specific data
    csvContent += await this.addCSVContent(reportType, dateRange);

    return Buffer.from(csvContent, 'utf8');
  }

  private addPDFContent(doc: any, reportType: string, dateRange: any) {
    // Add content based on report type
    switch (reportType) {
      case 'User Activity':
        doc.text('User Activity Summary:', 100, 220);
        doc.text('• Total Users: 1,234', 120, 250);
        doc.text('• Active Users: 856', 120, 270);
        doc.text('• New Registrations: 45', 120, 290);
        break;
      case 'System Performance':
        doc.text('System Performance Metrics:', 100, 220);
        doc.text('• Uptime: 99.9%', 120, 250);
        doc.text('• Response Time: 150ms', 120, 270);
        doc.text('• Error Rate: 0.1%', 120, 290);
        break;
      case 'Financial Summary':
        doc.text('Financial Summary:', 100, 220);
        doc.text('• Total Revenue: $45,678', 120, 250);
        doc.text('• Monthly Revenue: $12,345', 120, 270);
        doc.text('• Growth Rate: +15%', 120, 290);
        break;
      default:
        doc.text('Report data will be populated here...', 100, 220);
    }
  }

  private async addExcelContent(worksheet: any, reportType: string, dateRange: any) {
    // Add content based on report type
    switch (reportType) {
      case 'User Activity':
        worksheet.addRow(['Metric', 'Value']);
        worksheet.addRow(['Total Users', '1,234']);
        worksheet.addRow(['Active Users', '856']);
        worksheet.addRow(['New Registrations', '45']);
        break;
      case 'System Performance':
        worksheet.addRow(['Metric', 'Value']);
        worksheet.addRow(['Uptime', '99.9%']);
        worksheet.addRow(['Response Time', '150ms']);
        worksheet.addRow(['Error Rate', '0.1%']);
        break;
      case 'Financial Summary':
        worksheet.addRow(['Metric', 'Value']);
        worksheet.addRow(['Total Revenue', '$45,678']);
        worksheet.addRow(['Monthly Revenue', '$12,345']);
        worksheet.addRow(['Growth Rate', '+15%']);
        break;
      default:
        worksheet.addRow(['Data', 'Will be populated here...']);
    }
  }

  private async addCSVContent(reportType: string, dateRange: any): Promise<string> {
    let content = '';
    
    switch (reportType) {
      case 'User Activity':
        content += 'Metric,Value\n';
        content += 'Total Users,1,234\n';
        content += 'Active Users,856\n';
        content += 'New Registrations,45\n';
        break;
      case 'System Performance':
        content += 'Metric,Value\n';
        content += 'Uptime,99.9%\n';
        content += 'Response Time,150ms\n';
        content += 'Error Rate,0.1%\n';
        break;
      case 'Financial Summary':
        content += 'Metric,Value\n';
        content += 'Total Revenue,$45,678\n';
        content += 'Monthly Revenue,$12,345\n';
        content += 'Growth Rate,+15%\n';
        break;
      default:
        content += 'Data,Will be populated here...\n';
    }
    
    return content;
  }
}
