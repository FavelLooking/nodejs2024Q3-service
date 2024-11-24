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
import { LoggingService } from '../logging/logging.service';

@ApiTags('artist')
@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async getAllArtists(@Res() res: Response) {
    this.loggingService.log('Fetching all artists');
    const artists = await this.artistsService.findAll();
    return res.status(200).json(artists);
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Fetching artist with ID: ${id}`);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }
    const artist = await this.artistsService.findArtistById(id);
    if (artist) {
      this.loggingService.log(`Artist found: ${JSON.stringify(artist)}`);
      return res.status(200).json(artist);
    } else {
      this.loggingService.warn(`Artist with ID: ${id} not found`);
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Post()
  async createArtist(@Body() body: CreateArtistDto, @Res() res: Response) {
    const { name, grammy } = body;
    this.loggingService.log(`Creating artist with name: ${name}`);
    if (!name || typeof grammy !== 'boolean') {
      this.loggingService.warn('Missing required fields: name or grammy');
      return res.status(400).json('Please enter all information');
    } else {
      const newArtist = await this.artistsService.createNewArtist(body);
      this.loggingService.log(`Artist created: ${JSON.stringify(newArtist)}`);
      return res.status(201).json(newArtist);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateArtistDto,
    @Res() res: Response,
  ) {
    this.loggingService.log(`Updating artist with ID: ${id}`);
    const artistToUpdate = await this.artistsService.findArtistById(id);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }

    if (artistToUpdate) {
      const updatedArtist = await this.artistsService.updateArtist(id, body);
      this.loggingService.log(
        `Artist updated: ${JSON.stringify(updatedArtist)}`,
      );
      return res.status(200).json(updatedArtist);
    } else {
      this.loggingService.warn(`Artist with ID: ${id} not found`);
      return res.status(404).json({ message: 'Artist not found' });
    }
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }
    const artistToDelete = await this.artistsService.findArtistById(id);
    if (artistToDelete) {
      await this.artistsService.deleteArtist(id);
      this.loggingService.log(`Artist with ID: ${id} deleted`);
      return res.status(204).send();
    } else {
      this.loggingService.warn(`Artist with ID: ${id} not found`);
      return res.status(404).json({ message: 'Artist not found' });
    }
  }
}
