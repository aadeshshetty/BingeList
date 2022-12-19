import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-watched-list',
  templateUrl: './watched-list.component.html',
  styleUrls: ['./watched-list.component.css'],
})
export class WatchedListComponent implements OnInit {
  watchedList: Movie[] = [];
  constructor(private movieService: MovieService) {}

  s: string = '';
  onSearchText(search: string) {
    this.s = search;
  }

  ngOnInit(): void {
    this.getWatchedList();
  }

  getWatchedList() {
    // this.movieService.getMovies().subscribe((movies) => {
    //   movies.filter((movie: Movie) => {
    //     if (movie.watched === 'yes') {
    //       this.watchedList.push(movie);
    //     }
    //   });
    // });
  }

  removeMovie(movie: Movie) {
    let index = this.watchedList.findIndex((d) => d.id === movie.id); //find index in your array
    this.watchedList.splice(index, 1);
  }

  toggleWatched(movie: Movie) {
    this.movieService
      .toggleWatched({
        ...movie,
        watched: movie.watched === 'yes' ? 'no' : 'yes',
      })
      .subscribe();
    this.removeMovie(movie);
  }
}
