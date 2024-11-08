import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsBoolean()
  grammy: boolean;
}
