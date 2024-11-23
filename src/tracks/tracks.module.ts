import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, PrismaService, LoggingService],
})
export class TracksModule {}
