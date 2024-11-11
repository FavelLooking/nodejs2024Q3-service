import { PartialType } from '@nestjs/mapped-types';
import { CreateFavouriteTrackDto } from './create-favourite.dto';

export class UpdateFavouriteDto extends PartialType(CreateFavouriteTrackDto) {}
