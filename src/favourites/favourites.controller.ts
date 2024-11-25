import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { validateUUID } from '../helpers/helpers';
import { FavouritesService } from './favourites.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from '../logging/logging.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('favorites')
@Controller('favs')
export class FavouritesController {
  constructor(
    private readonly favouritesService: FavouritesService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllFavs(@Res() res: Response) {
    this.loggingService.log('Fetching all favourites');
    const favs = this.favouritesService.findAll();
    this.loggingService.log('Returning favourites: ' + JSON.stringify(favs));
    return res.status(200).json(favs);
  }

  @Post('track/:id')
  @UseGuards(JwtAuthGuard)
  addTrackToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Adding track to favourites with ID: ${id}`);
    console.log(body);

    const tracks = this.favouritesService.addTrack(body);
    this.loggingService.log(
      `Track added to favourites: ${JSON.stringify(tracks)}`,
    );
    return res.status(201).json(tracks);
  }

  @Post('album/:id')
  @UseGuards(JwtAuthGuard)
  addAlbumToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Adding album to favourites with ID: ${id}`);
    console.log(body);

    const albums = this.favouritesService.addAlbum(body);
    this.loggingService.log(
      `Album added to favourites: ${JSON.stringify(albums)}`,
    );
    return res.status(201).json(albums);
  }

  @Post('artist/:id')
  @UseGuards(JwtAuthGuard)
  addArtistToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Adding artist to favourites with ID: ${id}`);
    console.log(body);

    const artist = this.favouritesService.addArtist(body);
    this.loggingService.log(
      `Artist added to favourites: ${JSON.stringify(artist)}`,
    );
    return res.status(201).json(artist);
  }

  @Delete('track/:id')
  @UseGuards(JwtAuthGuard)
  deleteTrackFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Attempting to remove track with ID: ${id}`);
    this.favouritesService.removeTrack(id);
    this.loggingService.log(`Track with ID: ${id} removed from favourites`);
    return res.status(204).send();
  }

  @Delete('album/:id')
  @UseGuards(JwtAuthGuard)
  deleteAlbumFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Attempting to remove album with ID: ${id}`);
    this.favouritesService.removeAlbum(id);
    this.loggingService.log(`Album with ID: ${id} removed from favourites`);
    return res.status(204).send();
  }

  @Delete('artist/:id')
  @UseGuards(JwtAuthGuard)
  deleteArtistFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.loggingService.log(`Attempting to remove artist with ID: ${id}`);
    this.favouritesService.removeArtist(id);
    this.loggingService.log(`Artist with ID: ${id} removed from favourites`);
    return res.status(204).send();
  }
}
