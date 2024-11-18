import { Transform } from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;

  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value), {
    toClassOnly: true,
  })
  createdAt: number;

  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value), {
    toClassOnly: true,
  })
  updatedAt: number;

  version: number;
  password: string;
}
