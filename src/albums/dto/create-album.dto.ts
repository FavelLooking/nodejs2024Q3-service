import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
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