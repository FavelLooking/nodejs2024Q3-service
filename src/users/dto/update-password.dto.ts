import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The old password of the user',
    example: 'old_password123',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'new_password123',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
