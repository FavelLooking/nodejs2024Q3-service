import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validateUUID } from '../helpers/helpers';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  getAllArtists(@Res() res: Response) {
    const artists = this.artistsService.findAll();
    return res.status(200).json(artists);
  }

  @Get(':id')
  getArtistById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const artist = this.artistsService.findArtistById(id);
    if (artist) {
      return res.status(200).json(artist);
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Post()
  createArtist(@Body() body: CreateArtistDto, @Res() res: Response) {
    const { id, name, grammy } = body;
    if (!id || !name || !grammy) {
      return res.status(400).json('Please enter all information');
    } else {
      const newArtist = this.artistsService.createNewArtist(body);
      return res.status(201).json(newArtist);
    }
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateArtistDto,
    @Res() res: Response,
  ) {
    const artistToUpdate = this.artistsService.findArtistById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (artistToUpdate) {
      const updatedArtist = this.artistsService.updateArtist(id, body);
      return res.status(200).json(updatedArtist);
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const artistToDelete = this.artistsService.findArtistById(id);
    if (artistToDelete) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }
}
