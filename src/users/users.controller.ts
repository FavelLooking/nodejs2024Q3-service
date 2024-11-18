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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { validateUUID } from '../helpers/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.findAll();
    return res.status(200).json(users);
  }
  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }

    const user = await this.usersService.findUserById(id);

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }

  @Post()
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, password } = body;
    if (!login || !password) {
      return res.status(400).json('Please enter all information');
    } else {
      const newUser = await this.usersService.createNewUser(body);
      return res.status(201).json(newUser);
    }
  }
  @Put(':id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const userToUpdate = await this.usersService.findUserById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (userToUpdate) {
      if (userToUpdate.password !== body.oldPassword) {
        return res
          .status(403)
          .json({ message: 'Please enter correct old password' });
      }
      const updatedUser = await this.usersService.updateUserPassword(id, body);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const userToDelete = await this.usersService.findUserById(id);
    if (!validateUUID(id, res)) {
      return;
    }
    if (userToDelete) {
      await this.usersService.deleteUser(id);
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
