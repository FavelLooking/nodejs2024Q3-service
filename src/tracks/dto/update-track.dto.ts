import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @ApiProperty({
    description: 'The name of the track. This field is optional.',
    example: 'Blitzkrieg Bop',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description:
      'The ID of the artist associated with the track. This field is optional.',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  artistId?: string | null;

  @ApiProperty({
    description:
      'The ID of the album associated with the track. This field is optional.',
    example: '67890',
    required: false,
  })
  @IsOptional()
  @IsString()
  albumId?: string | null;

  @ApiProperty({
    description:
      'The duration of the track in seconds. This field is optional.',
    example: 210,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;
}
