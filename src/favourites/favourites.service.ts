import { Injectable } from '@nestjs/common';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavouritesService {
  static favs: Favorites = { artists: [], albums: [], tracks: [] };

  findAll() {
    return FavouritesService.favs;
  }

  addTrack(track: Track) {
    const existingTrack = TracksService.tracks.find((t) => t.id === track.id);

    if (!existingTrack) {
      throw new Error('Track not found');
    }
    FavouritesService.favs.tracks.push(track);
    console.log('Updated tracks in favs:', FavouritesService.favs.tracks);
  }

  addAlbum(album: Album) {
    FavouritesService.favs.albums.push(album);
    console.log('Updated albums in favs:', FavouritesService.favs.albums);
  }

  addArtist(artist: Artist) {
    FavouritesService.favs.artists.push(artist);
    console.log('Updated artists in favs:', FavouritesService.favs.artists);
  }

  removeTrack(id: string) {
    FavouritesService.favs.tracks = FavouritesService.favs.tracks.filter(
      (track) => track.id !== id,
    );
    console.log(
      'Updated tracks in favs after removal:',
      FavouritesService.favs.tracks,
    );
  }

  removeAlbum(id: string) {
    FavouritesService.favs.albums = FavouritesService.favs.albums.filter(
      (album) => album.id !== id,
    );
    console.log(
      'Updated albums in favs after removal:',
      FavouritesService.favs.albums,
    );
  }

  removeArtist(id: string) {
    FavouritesService.favs.artists = FavouritesService.favs.artists.filter(
      (artist) => artist.id !== id,
    );
    console.log(
      'Updated artists in favs after removal:',
      FavouritesService.favs.artists,
    );
  }
}
