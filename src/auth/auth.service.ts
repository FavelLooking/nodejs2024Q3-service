import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.CRYPT_SALT),
    );

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

  async login(loginDto: LoginDto) {
    const { login, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }
    console.log(process.env.JWT_SECRET_KEY);

    const payload = { userId: user.id, login: user.login };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    console.log('Generated Token:', token);

    return { id: user.id, accessToken: token };
  }
}
