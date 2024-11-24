import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The login of the user',
    example: 'Jim Morrison',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'MySecretPassword',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
