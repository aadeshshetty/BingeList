import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first, map, Observable, Subject, tap } from 'rxjs';
import { Movie } from '../models/movie.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/compat/database';
import * as firebase from 'firebase/compat';
import { DatePipe } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
  }),
};

export class Movies {
  movies!: Movie;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'http://localhost:3000/movies';
  private movieInfoUrl = 'https://v2.sg.media-imdb.com/suggestion/h/';
  private omdbUrl = 'https://www.omdbapi.com/?apikey=5284ac93&i=';
  private _updated = new Subject<void>();
  private imdbDetails = {};

  userId: string = '';
  date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  get Updated() {
    return this._updated;
  }
  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private datepipe: DatePipe
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
      // console.log(this.userId);
      this.getMovies();
    });
  }

  getMovies() {
    let movies = this.db.list(`/${this.userId}`);
    return movies
      .snapshotChanges()
      .pipe(
        map((users: any[]) =>
          users.map((user) => ({ Userid: user.key, ...user.payload.val() }))
        )
      );

    // return this.http.get<Movie[]>(this.baseUrl);
  }

  getMovieById(id: any) {
    let moviess: any = [];
    let req: any = null;
    this.getMovies().subscribe((movies) => {
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
          return;
        }

        if (Object.keys(movie).includes('description')) {
          moviess = movies;
          return;
        }
        // console.log('M length : ' + this.movies.length);
        for (let i = 0; i < moviess.length; i++) {
          if (moviess[i].id == id) {
            req = moviess[i];
            return req;
          }
        }
      });
      return;
    });
  }

  toggleWatched(movie: Movie) {
    movie.watched = !movie.watched;
    let keys: any;
    let req: any;
    this.getMovies()
      .pipe(first())
      .subscribe((movies) => {
        for (let i = 0; i < movies.length; i++) {
          if (movies[i].id == movie.id) {
            keys = movies[i].Userid;
            movies[i].watched = movie.watched;
            movies[i].dateWatched = movie.watched == true ? this.date : null;
            req = movies[i];
          }
        }
        this.db.list(`/${this.userId}/`).set(keys, req);
        this.Updated.next();
      });
  }

  dateWatched(movie: any, date: any) {
    let keys: any;
    let req: any;
    this.getMovies()
      .pipe(first())
      .subscribe((movies) => {
        for (let i = 0; i < movies.length; i++) {
          if (movies[i].id == movie.id) {
            keys = movies[i].Userid;
            movies[i].dateWatched = movie.watched == true ? date : null;
            req = movies[i];
          }
        }
        this.db.list(`/${this.userId}/`).set(keys, req);
        this.Updated.next();
      });
  }

  toggleLiked(movie: Movie) {
    let keys: any;
    this.getMovies()
      .pipe(first())
      .subscribe((movies) => {
        for (let i = 0; i < movies.length; i++) {
          if (movies[i].id === movie.id) {
            keys = movies[i].Userid;
            movies[i].liked = !movie.liked;
            this.db.list(`/${this.userId}/`).set(keys, movies[i]);
            this.Updated.next();
          }
        }
      });
  }

  addTags(movie: any, tags: any) {
    let keys: any;
    let req: any;
    this.getMovies()
      .pipe(first())
      .subscribe((movies) => {
        for (let i = 0; i < movies.length; i++) {
          if (movies[i].id === movie.id) {
            keys = movies[i].Userid;
            movies[i].tags = tags;
            this.db.list(`/${this.userId}/`).set(keys, movies[i]);
            this.Updated.next();
          }
        }
      });
  }

  addMovie(movie: Movie) {
    let movies = this.db.list(`/${this.userId}`);
    movies
      .push(movie)
      .then((resp) => {
        // console.log(resp);
      })
      .catch((error) => {
        console.error(error);
      });
    const url = `${this.baseUrl}`;
    // return this.http.post<Movie>(url, movie);
  }

  deleteMovie(key: any) {
    let keys: any;
    this.getMovies().subscribe((movies) => {
      for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === key) {
          keys = movies[i].Userid;
        }
      }
      this.db.list(`/${this.userId}/`).remove(keys);
    });
    // return this.http.delete<void>(url).pipe(
    //   tap(() => {
    //     this.Updated.next();
    //   })
    // );
  }

  getimdbInfo(movie: Movie): Observable<Movie> {
    let name = movie.title.split(' ').join('');
    const url = `${this.movieInfoUrl}${name}.json`;
    return this.http.get<Movie>(url);
  }

  getomdbInfo(id: String): Observable<any> {
    const url = `${this.omdbUrl}${id}&plot=full`;
    return this.http.get(url);
  }
}
