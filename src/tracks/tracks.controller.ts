import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validateUUID } from '../helpers/helpers';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from '../logging/logging.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('track')
@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTracks(@Res() res: Response) {
    this.loggingService.log('Fetching all tracks');
    const tracks = await this.tracksService.findAll();
    return res.status(200).json(tracks);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTrackById(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(
      `Start processing request to get track by ID: ${id}`,
    );
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID provided: ${id}`);
      return;
    }
    const track = await this.tracksService.findTrackById(id);
    if (track) {
      this.loggingService.log(`Track found: ${JSON.stringify(track)}`);
      return res.status(200).json(track);
    } else {
      this.loggingService.warn(`Track with ID ${id} not found`);
      return res.status(404).json({ message: 'Track not found' });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTrackDto,
    @Res() res: Response,
  ) {
    this.loggingService.log(`Start updating track with ID: ${id}`);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID provided: ${id}`);
      return;
    }
    const trackToUpdate = await this.tracksService.findTrackById(id);

    if (trackToUpdate) {
      const updatedTrack = await this.tracksService.updateTrack(id, body);
      this.loggingService.log(
        `Track updated successfully. ID: ${id}, Updated data: ${JSON.stringify(
          body,
        )}`,
      );
      return res.status(200).json(updatedTrack);
    } else {
      this.loggingService.warn(`Track with ID ${id} not found`);
      return res.status(404).json({ message: 'Track not found' });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTracks(@Param('id') id: string, @Res() res: Response) {
    this.loggingService.log(`Start deleting track with ID: ${id}`);
    if (!validateUUID(id, res)) {
      this.loggingService.warn(`Invalid UUID provided: ${id}`);
      return;
    }
    const userToDelete = await this.tracksService.findTrackById(id);
    if (userToDelete) {
      await this.tracksService.deleteTrack(id);
      this.loggingService.log(`Track deleted successfully. ID: ${id}`);
      return res.status(204).send();
    } else {
      this.loggingService.warn(`Track with ID ${id} not found`);
      return res.status(404).json({ message: 'Track not found' });
    }
  }
}
