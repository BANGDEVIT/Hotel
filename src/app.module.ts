import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ← dùng được ở toàn app, không cần import lại
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // ← tất cả route đều cần auth // thoát nếu có @Public()
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, //  ← tất cả route đều cần auth // thoát nếu không có @Roles()
    },
  ],
})
export class AppModule {}
