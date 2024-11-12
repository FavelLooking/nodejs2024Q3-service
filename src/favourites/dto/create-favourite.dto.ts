import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateFavouriteTrackDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  artistId: string | null;

  @IsOptional()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}

export class CreateFavouriteAlbumDto {
  @IsOptional()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  year: number;
  @IsString()
  @IsOptional()
  artistId: string | null;
}

export class CreateFavouriteArtistDto {
  @IsOptional()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
