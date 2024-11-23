import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class FavouritesService {
  static favs: Favorites = { artists: [], albums: [], tracks: [] };
  constructor(private readonly loggingService: LoggingService) {}

  addTrack(track: Track) {
    this.loggingService.log(`Attempting to add track with ID: ${track.id}`);
    //   const existingTrack = TracksService.tracks.find((t) => t.id === track.id);
    //   if (!existingTrack) {
    //     throw new Error('Track not found');
    //   }
    //   FavouritesService.favs.tracks.push(track);
    //   console.log('Updated tracks in favs:', FavouritesService.favs.tracks);
  }

  findAll() {
    this.loggingService.log('Fetching all favourites');
    return FavouritesService.favs;
  }

  addAlbum(album: Album) {
    this.loggingService.log(`Attempting to add album with ID: ${album.id}`);
    FavouritesService.favs.albums.push(album);
    this.loggingService.log(`Album with ID: ${album.id} added to favourites`);
  }

  addArtist(artist: Artist) {
    this.loggingService.log(`Attempting to add artist with ID: ${artist.id}`);
    FavouritesService.favs.artists.push(artist);
    this.loggingService.log(`Artist with ID: ${artist.id} added to favourites`);
  }

  removeTrack(id: string) {
    this.loggingService.log(`Attempting to remove track with ID: ${id}`);
    FavouritesService.favs.tracks = FavouritesService.favs.tracks.filter(
      (track) => track.id !== id,
    );
    this.loggingService.log(`Track with ID: ${id} removed from favourites`);
  }

  removeAlbum(id: string) {
    this.loggingService.log(`Attempting to remove album with ID: ${id}`);
    FavouritesService.favs.albums = FavouritesService.favs.albums.filter(
      (album) => album.id !== id,
    );
    this.loggingService.log(`Album with ID: ${id} removed from favourites`);
  }

  removeArtist(id: string) {
    this.loggingService.log(`Attempting to remove artist with ID: ${id}`);
    FavouritesService.favs.artists = FavouritesService.favs.artists.filter(
      (artist) => artist.id !== id,
    );
    this.loggingService.log(`Artist with ID: ${id} removed from favourites`);
  }
}
