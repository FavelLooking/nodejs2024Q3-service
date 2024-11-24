import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        version: 1,
        createdAt: new Date().getMilliseconds(),
        updatedAt: new Date().getMilliseconds(),
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }
}
