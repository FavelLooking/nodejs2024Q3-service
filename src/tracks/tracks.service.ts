import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}
  async createNewTrack(createTrackDto: CreateTrackDto) {
    this.loggingService.log(
      `Start creating new track with data: ${JSON.stringify(createTrackDto)}`,
    );
    const newTrack = this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: +createTrackDto.duration,
      },
    });
    this.loggingService.log(
      `New track created successfully: ${JSON.stringify(newTrack)}`,
    );
    return newTrack;
  }

  async findAll() {
    const tracks = await this.prisma.track.findMany();
    this.loggingService.log(`Successfully fetched ${tracks.length} tracks`);
    return tracks;
  }

  async findTrackById(id: string) {
    this.loggingService.log(`Searching for track with ID: ${id}`);
    return this.prisma.track.findUnique({ where: { id } });
  }

  async updateTrack(id: string, body: UpdateTrackDto) {
    this.loggingService.log(`Updating track with ID: ${id}`);
    const trackToUpdate = await this.findTrackById(id);
    const updatedTrack = {
      ...trackToUpdate,
      ...body,
    };
    this.loggingService.log(`Track with ID: ${id} successfully updated`);
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    await this.prisma.track.delete({ where: { id } });
    this.loggingService.log(`Track with ID: ${id} successfully deleted`);
  }
}
