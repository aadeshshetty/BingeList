import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { Movie } from '../models/movie.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/compat/database';

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
  get Updated() {
    return this._updated;
  }
  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
      // console.log(this.userId);
      this.getMovies();
    });
  }

  getMovies() {
    let movies = this.db.list(`/${this.userId}`);
    // console.log(movies.valueChanges().subscribe());
    return movies.valueChanges();

    // return this.http.get<Movie[]>(this.baseUrl);
  }

  // getMovieById(id: number): Observable<any> {
  //   return this.getMovies()!.pipe(
  //     map((movie: Movie[]) => movie.find((data) => data.id == id))
  //   );
  // }

  toggleWatched(movie: Movie): Observable<Movie> {
    const url = `${this.baseUrl}/${movie.id}`;
    return this.http.put<Movie>(url, movie, httpOptions).pipe(
      tap(() => {
        this.Updated.next();
      })
    );
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

  deleteMovie(movie: Movie): Observable<void> {
    const url = `${this.baseUrl}/${movie.id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.Updated.next();
      })
    );
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
