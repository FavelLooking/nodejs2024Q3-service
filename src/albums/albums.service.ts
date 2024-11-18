import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { TracksService } from '../tracks/tracks.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async createNewAlbum(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        artistId: createAlbumDto.artistId || null,
        year: createAlbumDto.year,
      },
    });
    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findAlbumById(id: string) {
    return await this.prisma.album.findUnique({ where: { id } });
  }

  async updateAlbum(id: string, body: UpdateAlbumDto) {
    const albumToUpdate = await this.findAlbumById(id);
    const updatedAlbum = {
      ...albumToUpdate,
      ...body,
    };
    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    await this.prisma.album.delete({
      where: { id },
    });

    // TracksService.tracks = TracksService.tracks.map((track) => {
    //   if (track.albumId === id) {
    //     return { ...track, albumId: null };
    //   }
    //   return track;
    // });
  }
}
