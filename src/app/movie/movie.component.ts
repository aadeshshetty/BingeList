import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie.model';
import { Rating } from '../models/rating.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private datepipe: DatePipe
  ) {}
  clicked: boolean = false;
  date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  movie = {} as Movie;
  rating: any = [];
  current: number = 0;
  id: number = this.route.snapshot.params['id'];
  tag: string = '';
  ngOnInit(): void {
    this.clicked = false;
    this.getMovie();
    this.rating?.forEach(
      (rate: any) =>
        ((rate.Value as Number) = Number(rate.Value.slice(0, 2)) / 2)
    );
  }
  getMovie() {
    // this.movieService.getMovieById(this.id).subscribe((movies) => {
    //   this.movie = movies;
    //   this.rating = this.movie.ratings;
    // });
  }
  toggleWatched(movie: Movie) {
    this.movieService
      .toggleWatched({
        ...movie,
        watched: movie.watched === 'yes' ? 'no' : 'yes',
        dateWatched: movie.watched === 'no' ? new Date(this.date!) : null,
      })
      .subscribe();
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }
  toggleLiked(movie: Movie) {
    this.movieService
      .toggleWatched({
        ...movie,
        liked: movie.liked === false ? true : false,
      })
      .subscribe();
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }
  dateChange(movie: Movie) {
    this.clicked = !this.clicked;
    this.movieService
      .toggleWatched({
        ...movie,
        dateWatched: movie.watched === 'yes' ? new Date(this.date!) : null,
      })
      .subscribe();
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }

  addTag(movie: Movie) {
    let taggs = movie.tags;
    if (this.tag !== '' && this.tag !== ' ') {
      taggs?.push(this.tag);
    }
    this.movieService
      .toggleWatched({
        ...movie,
        tags: taggs,
      })
      .subscribe();
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
      this.tag = '';
    });
  }
}
