import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TracksService {
  private tracks = [
    {
      id: 'b3e82d45-bfd2-4e52-9d27-df6fa97f6a32',
      name: 'Track 1 Name',
      artistId: 'd97f4824-d85c-4bfa-bcd2-6fd7b8439d67',
      albumId: 'f5c248e9-c5d2-47db-83b1-4b5fe9886a34',
      duration: 240,
    },
    {
      id: 'c5b32f79-1fbd-4b09-96a5-d15d52270e19',
      name: 'Track 2 Name',
      artistId: 'dbf2b8d2-d5b2-4d85-9f58-cb5d6b2b302b',
      albumId: 'f5c248e9-c5d2-47db-83b1-4b5fe9886a34',
      duration: 180,
    },
  ];
  createNewTrack(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuid(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: +createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findTrackById(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  updateTrack(id: string, body: UpdateTrackDto) {
    const trackToUpdate = this.findTrackById(id);
    const updatedUser = {
      ...trackToUpdate,
      ...body,
    };
    return updatedUser;
  }

  deleteTrack(id) {
    const currentTracks = this.tracks.filter((user) => user.id !== id);
    this.tracks = currentTracks;
  }
}
