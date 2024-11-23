import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, PrismaService, LoggingService],
})
export class AlbumsModule {}
