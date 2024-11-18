import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}
  async createNewTrack(createTrackDto: CreateTrackDto) {
    const newTrack = this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: +createTrackDto.duration,
      },
    });
    return newTrack;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findTrackById(id: string) {
    return this.prisma.track.findUnique({ where: { id } });
  }

  async updateTrack(id: string, body: UpdateTrackDto) {
    const trackToUpdate = await this.findTrackById(id);
    const updatedTrack = {
      ...trackToUpdate,
      ...body,
    };
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    const currentTracks = await this.prisma.track.delete({ where: { id } });
  }
}
