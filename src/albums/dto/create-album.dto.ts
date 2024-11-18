import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'The name of the album.',
    example: 'Greatest Hits',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The release year of the album.',
    example: 2021,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description:
      'The ID of the artist who created the album. Can be null if no artist is assigned.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  artistId: string | null;
}
