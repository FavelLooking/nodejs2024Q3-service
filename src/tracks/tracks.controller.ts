import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validateUUID } from '../helpers/helpers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('track')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async getAllTracks(@Res() res: Response) {
    const tracks = await this.tracksService.findAll();
    return res.status(200).json(tracks);
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const track = await this.tracksService.findTrackById(id);
    if (track) {
      return res.status(200).json(track);
    } else {
      return res.status(404).json({ message: 'Track not found' });
    }
  }

  @Post()
  async createTrack(@Body() body: CreateTrackDto, @Res() res: Response) {
    const { name, duration } = body;
    if (!name || !duration) {
      return res.status(400).json('Please enter all information');
    } else {
      const newTrack = await this.tracksService.createNewTrack(body);
      return res.status(201).json(newTrack);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTrackDto,
    @Res() res: Response,
  ) {
    const trackToUpdate = await this.tracksService.findTrackById(id);
    if (!validateUUID(id, res)) {
      return;
    }

    if (trackToUpdate) {
      const updatedTrack = await this.tracksService.updateTrack(id, body);
      return res.status(200).json(updatedTrack);
    } else {
      return res.status(404).json({ message: 'Track not found' });
    }
  }

  @Delete(':id')
  async deleteTracks(@Param('id') id: string, @Res() res: Response) {
    if (!validateUUID(id, res)) {
      return;
    }
    const userToDelete = await this.tracksService.findTrackById(id);
    if (userToDelete) {
      await this.tracksService.deleteTrack(id);
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Track not found' });
    }
  }
}
