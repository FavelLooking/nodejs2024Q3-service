import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumsService {
  static albums = [
    {
      id: 'a4b9f123-e34d-41c8-b8d5-8c5a6c5d6e34',
      name: 'Dookie',
      year: 1994,
      artistId: 'd1a4c8f3-6b2f-45e1-9a8b-12e4c5a7b6f1',
    },
    {
      id: 'b2d1c985-f3b2-4d7e-94c1-9e6d7b2e5f29',
      name: 'Raw Power',
      year: 1973,
      artistId: 'b2d5e4c1-7c3a-48d3-8b2d-34e5d6b8a9c2',
    },
  ];
  createNewAlbum(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: uuid(),
      name: createAlbumDto.name,
      artistId: createAlbumDto.artistId || null,
      year: createAlbumDto.year,
    };
    AlbumsService.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return AlbumsService.albums;
  }

  findAlbumById(id: string) {
    return AlbumsService.albums.find((album) => album.id === id);
  }

  updateAlbum(id: string, body: UpdateAlbumDto) {
    const albumToUpdate = this.findAlbumById(id);
    const updatedAlbum = {
      ...albumToUpdate,
      ...body,
    };
    return updatedAlbum;
  }

  deleteAlbum(id: string) {
    const currentAlbums = AlbumsService.albums.filter(
      (album) => album.id !== id,
    );
    AlbumsService.albums = currentAlbums;
  }
}
