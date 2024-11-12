import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid } from 'uuid';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ArtistsService {
  static artists = [
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
    ArtistsService.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return ArtistsService.artists;
  }

  findArtistById(id: string) {
    return ArtistsService.artists.find((artist) => artist.id === id);
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
    ArtistsService.artists = ArtistsService.artists.filter(
      (artist) => artist.id !== id,
    );

    TracksService.tracks = TracksService.tracks.map((track) => {
      if (track.artistId === id) {
        return { ...track, artistId: null };
      }
      return track;
    });

    AlbumsService.albums = AlbumsService.albums.map((album) => {
      if (album.artistId === id) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
