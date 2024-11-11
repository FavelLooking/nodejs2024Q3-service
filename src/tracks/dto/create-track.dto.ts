import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    description: 'The name of the track',
    example: 'Shape of You',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ID of the artist associated with the track',
    example: '12345',
    required: false,
  })
  @IsOptional()
  artistId: string | null;

  @ApiProperty({
    description: 'The ID of the album associated with the track',
    example: '67890',
    required: false,
  })
  @IsOptional()
  albumId: string | null;

  @ApiProperty({
    description: 'The duration of the track in seconds',
    example: 210,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
