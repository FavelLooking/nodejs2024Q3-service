import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      login: 'newUser',
      password: 'password123',
      version: 1,
      createdAt: 1633036800000,
      updatedAt: 1633036800000,
    },
    {
      id: '1f1f2e2b-846b-4265-bb96-7ec7d1c7c7c7',
      login: 'NewUser1',
      password: 'password1234',
      version: 2,
      createdAt: 1640995200000,
      updatedAt: 1643587200000,
    },
  ];

  findAll() {
    return this.users;
  }
  findUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }
}
