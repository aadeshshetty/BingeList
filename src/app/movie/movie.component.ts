import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie.model';
import { Rating } from '../models/rating.model';
import { AuthService } from '../services/auth.service';
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
    private datepipe: DatePipe,
    private auth: AngularFireAuth
  ) {}
  clicked: boolean = false;
  date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  movie = {} as Movie;
  rating: any = [];
  current: number = 0;
  userId: any = '';
  id: number = this.route.snapshot.params['id'];
  tag: string = '';
  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
    });
    this.clicked = false;
    this.getMovie();
    this.rating?.forEach(
      (rate: any) =>
        ((rate.Value as Number) = Number(rate.Value.slice(0, 2)) / 2)
    );
  }
  getMovie() {
    let moviess: any = [];
    let req: any;
    this.movieService.getMovies().subscribe((movies) => {
      movies.map((movie) => {
        let obj: any = movie;
        let flag = false;
        let key = Object.keys(obj);
        if (movie.Userid === this.userId) {
          for (let i = 1; i < key.length; i++) {
            moviess.forEach((m: Movie) => {
              if (m.title === obj[key[i]].title) flag = true;
            });
            if (!flag) moviess.push(obj[key[i]]);
          }
        }

        if (Object.keys(movie).includes('description')) {
          moviess = movies;
        }
        // console.log('M length : ' + this.movies.length);
        for (let i = 0; i < moviess.length; i++) {
          if (moviess[i].id == this.id) {
            req = moviess[i];
            this.movie = req;
          }
        }
      });
    });
  }
  toggleWatched(movie: Movie) {
    this.movieService.toggleWatched(movie);
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }
  toggleLiked(movie: Movie) {
    this.movieService.toggleLiked(movie);
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }
  dateChange(movie: Movie) {
    this.clicked = !this.clicked;
    this.movieService.dateWatched(movie, this.date);
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
    });
  }

  addTag(movie: Movie) {
    let taggs = movie.tags;
    if (taggs == undefined) {
      taggs = [];
    }
    if (this.tag != '' && this.tag != ' ') {
      taggs?.push(this.tag);
    }

    this.movieService.addTags(movie, taggs);
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
      this.tag = '';
    });
  }
  clearTags(movie: Movie) {
    this.movieService.addTags(movie, []);
    this.movieService.Updated.subscribe((response) => {
      this.getMovie();
      this.tag = '';
    });
  }
}
