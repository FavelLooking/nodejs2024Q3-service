import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, LoggingService],
})
export class UsersModule {}
