import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArtistsService {
  private artists = [
    {
      id: 'd1a4c8f3-6b2f-45e1-9a8b-12e4c5a7b6f1',
      name: 'Green Day',
      grammy: true,
    },
    {
      id: 'b2d5e4c1-7c3a-48d3-8b2d-34e5d6b8a9c2',
      name: 'Iggy Pop',
      grammy: false,
    },
  ];
  createNewArtist(body: CreateArtistDto) {
    const newArtist = {
      id: uuid(),
      name: body.name,
      grammy: body.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findArtistById(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  updateArtist(id: string, body: UpdateArtistDto) {
    const artistToUpdate = this.findArtistById(id);
    const updatedArtist = {
      ...artistToUpdate,
      ...body,
    };
    return updatedArtist;
  }

  deleteArtist(id: string) {
    const currentArtist = this.artists.filter((artist) => artist.id !== id);
    this.artists = currentArtist;
  }
}
