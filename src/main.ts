import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Project description
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  // Áp dụng ValidationPipe cho toàn bộ app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép những field có trong DTO
      forbidNonWhitelisted: true, // Nếu có field lạ → bắn lỗi luôn (400)
      transform: true, // Tự động convert dữ liệu sang đúng kiểu trong DTO
      transformOptions: {
        enableImplicitConversion: true, // Cho phép convert kiểu tự động mà không cần decorator
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Hotel Management API') // ← đổi title
    .setDescription('API documentation for Hotel Management System') // ← đổi description
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('rooms', 'Room management endpoints') // ← thêm tags cho sau
    .addTag('bookings', 'Booking management endpoints') // ← thêm tags cho sau
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // ← giữ token sau khi refresh trang
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Hotel Management API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
    .swagger-ui .topbar {display: none}
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #4A90E2; }
  `,
  });

  await app.listen(process.env.PORT);
}
bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
