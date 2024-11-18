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

@ApiTags('album')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAllAlbums(@Res() res: Response) {
    const albums = await this.albumsService.findAll();
    return res.status(200).json(albums);
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const album = await this.albumsService.findAlbumById(id);
    if (album) {
      return res.status(200).json(album);
    } else {
      return res.status(404).json({ message: 'Album not found' });
    }
  }

  @Post()
  async createAlbum(@Body() body: CreateAlbumDto, @Res() res: Response) {
    const { name, year } = body;
    if (!name || !year) {
      return res.status(400).json('Please enter all information');
    } else {
      const newAlbum = await this.albumsService.createNewAlbum(body);
      return res.status(201).json(newAlbum);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    const albumToUpdate = await this.albumsService.findAlbumById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (albumToUpdate) {
      const updatedAlbum = await this.albumsService.updateAlbum(id, body);
      return res.status(200).json(updatedAlbum);
    } else {
      return res.status(404).json({ message: 'Album not found' });
    }
  }

  @Delete(':id')
  async deleteAlbums(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const albumToDelete = await this.albumsService.findAlbumById(id);
    if (albumToDelete) {
      await this.albumsService.deleteAlbum(id);
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Album not found' });
    }
  }
}
