import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Rate limiting - completely disabled for development
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  // Development bypass middleware - must be before any rate limiting
  if (isDevelopment) {
    app.use((req, res, next) => {
      // Add headers to bypass any rate limiting
      res.set('X-RateLimit-Limit', 'unlimited');
      res.set('X-RateLimit-Remaining', 'unlimited');
      res.set('X-RateLimit-Reset', 'never');
      next();
    });
  }
  
  if (!isDevelopment) {
    // Only apply rate limiting in production
    app.use(
      rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
      }),
    );

    // Specific rate limiting for authentication endpoints in production only
    app.use('/auth', 
      rateLimit({
        windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10, // 10 attempts in prod
        message: 'Too many authentication attempts from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true, // Don't count successful requests
      })
    );
  } else {
    console.log('🚀 Development mode: Rate limiting disabled for easier testing');
    
    // Add development bypass middleware for localhost
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Skip rate limiting for localhost in development
      if (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1') {
        console.log(`🔓 Development  ${req.ip} - ${req.method} ${req.path}`);
      }
      next();
    });
  }

  // Development bypasses
  if (isDevelopment) {
    // Bypass rate limiting for authentication endpoints in development
    app.use('/auth', (req: any, res: any, next: any) => {
      console.log(`🔓 Auth  ${req.method} ${req.path} from ${req.ip}`);
      next();
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Healthcare Management System API')
    .setDescription(`
      ## Complete Healthcare Management System API

.
    `)
    .setVersion('1.0.0')
    .setContact('Healthcare Team', 'http://localhost:5173/', 'support@healthcare-system.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Doctors', 'Doctor profile and management endpoints')
    .addTag('Patients', 'Patient profile and management endpoints')
    .addTag('Appointments', 'Appointment booking and management endpoints')
    .addTag('Prescriptions', 'Prescription management endpoints')
    .addTag('Notifications', 'Notification system endpoints')
    .addTag('Dashboard', 'Analytics and dashboard endpoints')
    .addTag('Settings', 'System settings and configuration endpoints')
    .addTag('Upload', 'File upload and management endpoints')
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.healthcare-system.com', 'Production server')
    .build();
    
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'Healthcare API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 4px; }
    `,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`🚀 Healthcare API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
