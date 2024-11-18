import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService, PrismaService],
})
export class FavouritesModule {}
