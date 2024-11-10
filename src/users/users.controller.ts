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

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Res() res: Response) {
    //don't forget to use async in next parts of this task
    const users = this.usersService.findAll();
    return res.status(200).json(users);
  }
  @Get(':id')
  getUserById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }

    const user = this.usersService.findUserById(id);

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }

  @Post()
  createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, password } = body;
    if (!login || !password) {
      return res.status(400).json('Please enter all information');
    } else {
      const newUser = this.usersService.createNewUser(body);
      return res.status(201).json(newUser);
    }
  }
  @Put(':id')
  updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const userToUpdate = this.usersService.findUserById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (userToUpdate) {
      console.log(userToUpdate.password, body.oldPassword);
      if (userToUpdate.password !== body.oldPassword) {
        return res
          .status(403)
          .json({ message: 'Please enter correct old password' });
      }
      const updatedUser = this.usersService.updateUserPassword(id, body);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    const userToDelete = this.usersService.findUserById(id);
    if (!validateUUID(id, res)) {
      return;
    }
    if (userToDelete) {
      this.usersService.deleteUser(id);
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
