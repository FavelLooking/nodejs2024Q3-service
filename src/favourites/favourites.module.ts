import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService, PrismaService, LoggingService],
})
export class FavouritesModule {}
