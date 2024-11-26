import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { validateUUID } from '../helpers/helpers';
import { FavouritesService } from './favourites.service';
import { ApiTags } from '@nestjs/swagger';
//import { CreateFavouriteTrackDto } from './dto/create-favourite.dto';

@ApiTags('favorites')
@Controller('favs')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  getAllFavs(@Res() res: Response) {
    const favs = this.favouritesService.findAll();
    console.log('Returning favs:', favs);
    return res.status(200).json(favs);
  }

  @Post('track/:id')
  addTrackToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    console.log(body);

    const tracks = this.favouritesService.addTrack(body);
    return res.status(201).json(tracks);
  }

  @Post('album/:id')
  addAlbumToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    console.log(body);
    const albums = this.favouritesService.addAlbum(body);
    return res.status(201).json(albums);
  }

  @Post('artist/:id')
  addArtistToFavs(@Param('id') id: string, @Body() body, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    console.log(body);
    const artist = this.favouritesService.addArtist(body);
    return res.status(201).json(artist);
  }

  @Delete('track/:id')
  deleteTrackFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.favouritesService.removeTrack(id);
    return res.status(204).send();
  }
  @Delete('album/:id')
  deleteAlbumFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.favouritesService.removeAlbum(id);
    return res.status(204).send();
  }

  @Delete('artist/:id')
  deleteArtistFromFavs(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    this.favouritesService.removeArtist(id);
    return res.status(204).send();
  }
}
