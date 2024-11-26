import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private users = [
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
      version: 1,
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
  createNewUser({ login, password }: CreateUserDto) {
    const newUser = {
      id: uuid(),
      login,
      password,
      version: 1,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    };
    this.users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  updateUserPassword(id: string, body: UpdatePasswordDto) {
    const userToUpdate = this.findUserById(id);

    userToUpdate.password = body.newPassword;
    userToUpdate.version += 1;
    userToUpdate.updatedAt = Date.now();
    const { password, ...userWithoutPassword } = userToUpdate;
    this.saveUser(userToUpdate);
    return userWithoutPassword;
  }
  saveUser(updatedUser: User) {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }
  deleteUser(id: string) {
    const currentUsers = this.users.filter((user) => user.id !== id);
    this.users = [...currentUsers];
  }
}
