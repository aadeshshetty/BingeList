import { Rating } from '../models/rating.model';

export interface Movie {
  title: string;
  year: number;
  description: string;
  image?: string;
  ratings?: Rating[];
  watched: string;
  dateWatched?: Date | null;
  liked?: boolean;
  id: number;
  director?: string;
  stars?: string[];
  runtime?: string;
  releaseDate?: string;
  genres?: string;
  tags?: string[];
  comments?: string[];
}
