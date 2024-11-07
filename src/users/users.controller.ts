import { Controller, Get, Res, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { validate as isValidUUID } from 'uuid';

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
    if (!isValidUUID(id)) {
      return res.status(400).json({ message: 'User ID is invalid' });
    }

    const user = this.usersService.findUserById(id);

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
