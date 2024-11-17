import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.user.findMany();
  }
  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async createNewUser({ login, password }: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          login,
          password,
          version: 1,
          createdAt: new Date().getMilliseconds(),
          updatedAt: new Date().getMilliseconds(),
        },
      });
      const { password: _, ...userWithoutPassword } = newUser;
      console.log(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }
  async updateUserPassword(id: string, body: UpdatePasswordDto) {
    const userToUpdate = await this.findUserById(id);

    if (!userToUpdate) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: body.newPassword,
        version: userToUpdate.version + 1,
        updatedAt: new Date().getMilliseconds(),
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const userToDelete = await this.findUserById(id);
    if (!userToDelete) {
      throw new Error('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
