import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async createNewArtist(body: CreateArtistDto) {
    this.loggingService.log('Creating a new artist');
    const newArtist = await this.prisma.artist.create({
      data: {
        name: body.name,
        grammy: body.grammy,
      },
    });
    this.loggingService.log(`Artist created: ${newArtist.id}`);
    return newArtist;
  }

  async findAll() {
    this.loggingService.log('Fetching all artists');
    const artists = await this.prisma.artist.findMany();
    this.loggingService.log(`Found ${artists.length} artists`);
    return artists;
  }

  async findArtistById(id: string) {
    this.loggingService.log(`Fetching artist with ID: ${id}`);
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    this.loggingService.log(`Found artist with ID: ${id}`);
    return artist;
  }

  async updateArtist(id: string, body: UpdateArtistDto) {
    this.loggingService.log(`Updating artist with ID: ${id}`);
    const artistToUpdate = await this.findArtistById(id);
    if (!artistToUpdate) {
      this.loggingService.warn(`Artist with ID: ${id} not found for update`);
      throw new Error('Artist not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: body,
    });
    this.loggingService.log(`Artist with ID: ${id} updated`);
    return updatedArtist;
  }
  async deleteArtist(id: string) {
    this.loggingService.log(`Deleting artist with ID: ${id}`);
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
    this.loggingService.log(`Artist with ID: ${id} deleted successfully`);
  }
}
