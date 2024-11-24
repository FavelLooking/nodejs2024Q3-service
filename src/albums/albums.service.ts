import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async createNewAlbum(createAlbumDto: CreateAlbumDto) {
    this.loggingService.log(
      `Creating a new album: ${JSON.stringify(createAlbumDto)}`,
    );
    const newAlbum = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        artistId: createAlbumDto.artistId || null,
        year: createAlbumDto.year,
      },
    });
    this.loggingService.log(`New album created with ID: ${newAlbum.id}`);
    return newAlbum;
  }

  async findAll() {
    this.loggingService.log('Fetching all albums');
    const albums = await this.prisma.album.findMany();
    this.loggingService.log(`Found ${albums.length} albums`);
    return albums;
  }

  async findAlbumById(id: string) {
    this.loggingService.log(`Fetching album with ID: ${id}`);
    const album = await this.prisma.album.findUnique({ where: { id } });
    this.loggingService.log(`Album found with ID: ${id}`);
    return album;
  }

  async updateAlbum(id: string, body: UpdateAlbumDto) {
    this.loggingService.log(`Updating album with ID: ${id}`);
    const albumToUpdate = await this.findAlbumById(id);
    const updatedAlbum = {
      ...albumToUpdate,
      ...body,
    };
    this.loggingService.log(`Album with ID: ${id} updated successfully`);
    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    this.loggingService.log(`Deleting album with ID: ${id}`);
    await this.prisma.album.delete({
      where: { id },
    });
    this.loggingService.log(`Album with ID: ${id} deleted successfully`);
  }
}
