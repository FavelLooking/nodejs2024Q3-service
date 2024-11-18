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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('artist')
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async getAllArtists(@Res() res: Response) {
    const artists = await this.artistsService.findAll();
    return res.status(200).json(artists);
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const artist = await this.artistsService.findArtistById(id);
    if (artist) {
      return res.status(200).json(artist);
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Post()
  async createArtist(@Body() body: CreateArtistDto, @Res() res: Response) {
    const { name, grammy } = body;
    if (!name || typeof grammy !== 'boolean') {
      return res.status(400).json('Please enter all information');
    } else {
      const newArtist = await this.artistsService.createNewArtist(body);
      return res.status(201).json(newArtist);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateArtistDto,
    @Res() res: Response,
  ) {
    const artistToUpdate = await this.artistsService.findArtistById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (artistToUpdate) {
      const updatedArtist = await this.artistsService.updateArtist(id, body);
      return res.status(200).json(updatedArtist);
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const artistToDelete = await this.artistsService.findArtistById(id);
    if (artistToDelete) {
      await this.artistsService.deleteArtist(id);
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Artist not found' });
    }
  }
}
