import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  providers: [AuthService, PrismaService, LoggingService],
  controllers: [AuthController],
})
export class AuthModule {}
