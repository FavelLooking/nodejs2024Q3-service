import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  artistId: string | null;

  @IsNotEmpty()
  @IsString()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
