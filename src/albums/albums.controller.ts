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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Response } from 'express';
import { validateUUID } from '../helpers/helpers';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from '../logging/logging.service';

@ApiTags('album')
@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async getAllAlbums(@Res() res: Response) {
    this.loggingService.log('Fetching all albums');
    const albums = await this.albumsService.findAll();
    this.loggingService.log(`Found ${albums.length} albums`);
    return res.status(200).json(albums);
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Fetching album with ID: ${id}`);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }
    const album = await this.albumsService.findAlbumById(id);
    if (album) {
      this.loggingService.log(`Album found with ID: ${id}`);
      return res.status(200).json(album);
    } else {
      this.loggingService.warn(`Album not found with ID: ${id}`);
      return res.status(404).json({ message: 'Album not found' });
    }
  }

  @Post()
  async createAlbum(@Body() body: CreateAlbumDto, @Res() res: Response) {
    this.loggingService.log(`Creating a new album: ${JSON.stringify(body)}`);
    const { name, year } = body;
    if (!name || !year) {
      this.loggingService.warn('Missing required fields for album creation');
      return res.status(400).json('Please enter all information');
    } else {
      const newAlbum = await this.albumsService.createNewAlbum(body);
      this.loggingService.log(`Album created with ID: ${newAlbum.id}`);
      return res.status(201).json(newAlbum);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    this.loggingService.log(`Updating album with ID: ${id}`);
    const albumToUpdate = await this.albumsService.findAlbumById(id);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }

    if (albumToUpdate) {
      const updatedAlbum = await this.albumsService.updateAlbum(id, body);
      this.loggingService.log(`Album with ID: ${id} updated successfully`);
      return res.status(200).json(updatedAlbum);
    } else {
      this.loggingService.warn(`Album not found with ID: ${id}`);
      return res.status(404).json({ message: 'Album not found' });
    }
  }

  @Delete(':id')
  async deleteAlbums(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Deleting album with ID: ${id}`);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }
    const albumToDelete = await this.albumsService.findAlbumById(id);
    if (albumToDelete) {
      await this.albumsService.deleteAlbum(id);
      this.loggingService.log(`Album with ID: ${id} deleted successfully`);
      return res.status(204).send();
    } else {
      this.loggingService.warn(`Album not found with ID: ${id}`);
      return res.status(404).json({ message: 'Album not found' });
    }
  }
}
