import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async createNewArtist(body: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: {
        name: body.name,
        grammy: body.grammy,
      },
    });
    return newArtist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findArtistById(id: string) {
    return await this.prisma.artist.findUnique({ where: { id } });
  }

  async updateArtist(id: string, body: UpdateArtistDto) {
    const artistToUpdate = await this.findArtistById(id);
    if (!artistToUpdate) {
      throw new Error('Artist not found');
    }

    return await this.prisma.artist.update({
      where: { id },
      data: body,
    });
  }
  async deleteArtist(id: string) {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.artist.delete({
      where: { id },
    });
  }
}
