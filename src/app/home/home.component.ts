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
import { ActivatedRoute, Router } from '@angular/router';
import { clippingParents } from '@popperjs/core';
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
  s: string = '';
  userId: string = '';
  date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  onSearchText(search: string) {
    this.s = search.toLowerCase();
  }

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
    });
  }

  ngOnInit(): void {
    this.getMovies();
  }
  ngDoCheck(): void {}
  getMovies() {
    this.movieService.getMovies().subscribe((movies) => {
      console.log(movies);

      movies.map((movie) => {
        let obj: any = movies[0];
        let key = Object.keys(obj);
        this.movies.push(obj[key[0]]);
      });
      this.changeDetector.detectChanges();
    });
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
      this.getMovies();
    });
  }

  removeFromList(movie: Movie) {
    this.movieService.deleteMovie(movie).subscribe();
    this.movieService.Updated.subscribe(() => {
      this.getMovies();
    });
  }
}
