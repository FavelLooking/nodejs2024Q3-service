import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { validateUUID } from '../helpers/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from '../logging/logging.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    this.loggingService.log('Fetching all users');
    const users = await this.usersService.findAll();
    return res.status(200).json(users);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Fetching user with ID: ${id}`);

    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }

    const user = await this.usersService.findUserById(id);

    if (user) {
      this.loggingService.log(`User found: ${JSON.stringify(user)}`);
      return res.status(200).json(user);
    } else {
      this.loggingService.warn(`User with ID: ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, password } = body;
    this.loggingService.log(`Creating user with login: ${login}`);

    if (!login || !password) {
      this.loggingService.warn('Missing required fields: login or password');
      return res.status(400).json('Please enter all information');
    } else {
      const newUser = await this.usersService.createNewUser(body);
      this.loggingService.log(`User created: ${JSON.stringify(newUser)}`);
      return res.status(201).json(newUser);
    }
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    this.loggingService.log(`Updating password for user with ID: ${id}`);

    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }

    const userToUpdate = await this.usersService.findUserById(id);
    if (userToUpdate) {
      if (userToUpdate.password !== body.oldPassword) {
        this.loggingService.warn(`Old password mismatch for user ID: ${id}`);
        return res
          .status(403)
          .json({ message: 'Please enter correct old password' });
      }
      const updatedUser = await this.usersService.updateUserPassword(id, body);
      this.loggingService.log(`Password updated for user: ${id}`);
      return res.status(200).json(updatedUser);
    } else {
      this.loggingService.warn(`User with ID: ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Deleting user with ID: ${id}`);

    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID: ${id}`);
      return;
    }

    const userToDelete = await this.usersService.findUserById(id);
    if (userToDelete) {
      await this.usersService.deleteUser(id);
      this.loggingService.log(`User with ID: ${id} deleted`);
      return res.status(204).send();
    } else {
      this.loggingService.warn(`User with ID: ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
