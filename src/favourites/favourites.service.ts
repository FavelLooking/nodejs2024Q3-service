import { Injectable } from '@nestjs/common';

@Injectable()
export class FavouritesService {
  static favs: Favorites = { artists: [], albums: [], tracks: [] };

  addTrack(track: Track) {
    //   const existingTrack = TracksService.tracks.find((t) => t.id === track.id);
    //   if (!existingTrack) {
    //     throw new Error('Track not found');
    //   }
    //   FavouritesService.favs.tracks.push(track);
    //   console.log('Updated tracks in favs:', FavouritesService.favs.tracks);
  }

  findAll() {
    return FavouritesService.favs;
  }

  addAlbum(album: Album) {
    FavouritesService.favs.albums.push(album);
  }

  addArtist(artist: Artist) {
    FavouritesService.favs.artists.push(artist);
  }

  removeTrack(id: string) {
    FavouritesService.favs.tracks = FavouritesService.favs.tracks.filter(
      (track) => track.id !== id,
    );
  }

  removeAlbum(id: string) {
    FavouritesService.favs.albums = FavouritesService.favs.albums.filter(
      (album) => album.id !== id,
    );
  }

  removeArtist(id: string) {
    FavouritesService.favs.artists = FavouritesService.favs.artists.filter(
      (artist) => artist.id !== id,
    );
  }
}
