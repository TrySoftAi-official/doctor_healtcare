import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    console.log('Uploading file:', {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    const fileUrl = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/uploads/${file.filename}`;
    
    const result = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: fileUrl,
    };

    console.log('File upload result:', result);
    return result;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(file => this.uploadFile(file))
    );

    return uploadedFiles;
  }

  async deleteFile(filename: string) {
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    try {
      fs.unlinkSync(filePath);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new Error('File not found or could not be deleted');
    }
  }
}
