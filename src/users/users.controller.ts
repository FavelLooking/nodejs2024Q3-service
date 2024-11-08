import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { validateUUID } from 'src/helpers/helpers';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Res() res: Response) {
    //don't forget to use async in next parts of this task
    const users = this.usersService.findAll();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(users);
  }
  @Get(':id')
  getUserById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }

    const user = this.usersService.findUserById(id);

    if (user) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
      if (userToUpdate.password !== body.oldPassword) {
        return res
          .status(403)
          .json({ message: 'Please enter correct old password' });
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const updatedUser = this.usersService.updateUserPassword(id, body);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
  }
}
