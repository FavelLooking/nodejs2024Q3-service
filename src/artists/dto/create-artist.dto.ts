import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    description: 'The name of the artist.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Indicates whether the artist has won a Grammy.',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
