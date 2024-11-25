import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll() {
    this.loggingService.log('Fetching all users...');
    return await this.prisma.user.findMany();
  }
  async findUserById(id: string) {
    this.loggingService.log(`Fetching user with ID: ${id}`);
    return this.prisma.user.findUnique({ where: { id } });
  }
  async createNewUser({ login, password }: CreateUserDto) {
    try {
      this.loggingService.log('Creating user...');
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
      this.loggingService.log(`User created with login: ${login}`);
      return userWithoutPassword;
    } catch (error) {
      this.loggingService.error(
        `Error creating new user: ${error.message}\n${error.stack}`,
      );
      throw new Error('Error creating user');
    }
  }
  async updateUserPassword(id: string, body: UpdatePasswordDto) {
    try {
      this.loggingService.log(`Fetching user with id: ${id}`);
      const userToUpdate = await this.findUserById(id);

      if (!userToUpdate) {
        this.loggingService.error(`User with id: ${id} not found`);
        throw new Error('User not found');
      }
      this.loggingService.log(
        `User with id: ${id} found, let's update password...`,
      );

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password: body.newPassword,
          version: userToUpdate.version + 1,
          updatedAt: new Date().getMilliseconds(),
        },
      });

      const { password, ...userWithoutPassword } = updatedUser;
      this.loggingService.log(
        `Password for user with id: ${id} updated successfully`,
      );
      return userWithoutPassword;
    } catch (error) {
      this.loggingService.error(
        `Error updating password for user with id: ${id} - ${error.message}\n${error.stack}`,
      );
      throw new Error('Error updating user password');
    }
  }

  async deleteUser(id: string) {
    try {
      this.loggingService.log(`Fetching user with id: ${id} to delete`);
      const userToDelete = await this.findUserById(id);
      if (!userToDelete) {
        this.loggingService.error(`User with id: ${id} not found for deletion`);
        throw new Error('User not found');
      }
      this.loggingService.log(`User with id: ${id} found, start deleting`);
      await this.prisma.user.delete({ where: { id } });
      this.loggingService.log(`User with id: ${id} deleted successfully`);
    } catch (error) {
      this.loggingService.error(
        `Error deleting user with id: ${id} - ${error.message}\n${error.stack}`,
      );
      throw new Error('Error deleting user');
    }
  }
}
