import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router, RouterLink, Routes } from '@angular/router';
import { clippingParents } from '@popperjs/core';
import { first, Subscriber } from 'rxjs';
import { Movie } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';

export interface obj {
  id: Movie;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  userId: string = '';
  date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private auth: AngularFireAuth,
    private router: Router
  ) {}
  s: string = '';
  onSearchText(search: string) {
    this.s = search.toLowerCase();
  }

  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
      this.getMovies();
    });
  }

  getMovies() {
    this.movies = [];

    this.movieService
      .getMovies()
      .pipe(first())
      .subscribe((movies) => {
        // console.log(movies);
        movies.map((movie) => {
          let obj: any = movie;
          let flag = false;
          let key = Object.keys(obj);
          if (movie.Userid === this.userId) {
            for (let i = 1; i < key.length; i++) {
              this.movies.forEach((m: Movie) => {
                if (m.title === obj[key[i]].title) flag = true;
              });
              if (!flag) {
                this.movies.push(obj[key[i]]);
                flag = false;
              }
              // console.log(obj[key[i]].title);
            }
            return;
          }

          if (Object.keys(movie).includes('description')) {
            this.movies = movies;
            return;
          }
          // console.log('M length : ' + this.movies.length);
          console.log(this.movies);
          return;
        });
      });
  }
  toggleWatched(moviee: Movie) {
    this.movieService.toggleWatched(moviee);
    this.movieService.Updated.subscribe((response) => {
      this.getMovies();
    });
  }

  removeFromList(movie: any) {
    // this.movies.s
    // console.log('Movie : ', movie);

    this.movies = this.movies.filter((m) => {
      return m.id !== movie;
    });

    // console.log('Delete : ', this.movies);

    this.movieService.deleteMovie(movie);
  }
}
