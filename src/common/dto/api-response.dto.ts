import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {}
  })
  data?: T;

  @ApiProperty({
    description: 'Error details (if any)',
    example: null,
    required: false
  })
  error?: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-01T00:00:00.000Z'
  })
  timestamp: string;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({
    description: 'Pagination information',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
      hasNext: true,
      hasPrev: false
    }
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: false
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed'
  })
  message: string;

  @ApiProperty({
    description: 'Error details',
    example: 'Email is required'
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-01T00:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Validation errors (if any)',
    example: ['Email is required', 'Password must be at least 6 characters'],
    required: false
  })
  validationErrors?: string[];
}
