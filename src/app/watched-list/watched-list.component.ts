import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-watched-list',
  templateUrl: './watched-list.component.html',
  styleUrls: ['./watched-list.component.css'],
})
export class WatchedListComponent implements OnInit {
  watchedList: Movie[] = [];
  userId: string = '';
  constructor(
    private watchedListervice: MovieService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) this.userId = user.uid;
    });
  }

  s: string = '';
  onSearchText(search: string) {
    this.s = search;
  }

  ngOnInit(): void {
    this.getWatchedList();
  }

  getWatchedList() {
    this.watchedList = [];

    this.watchedListervice
      .getMovies()
      .pipe(first())
      .subscribe((movies: any) => {
        // console.log(watchedList);
        movies.map((movie: any) => {
          let obj: any = movie;
          let flag = false;
          let key = Object.keys(obj);
          if (movie.Userid === this.userId) {
            for (let i = 1; i < key.length; i++) {
              this.watchedList.forEach((m: Movie) => {
                if (m.title === obj[key[i]].title) flag = true;
              });
              if (!flag && obj[key[i]].watched == true) {
                this.watchedList.push(obj[key[i]]);
                flag = false;
              }
            }
            return;
          }

          if (Object.keys(movie).includes('description')) {
            this.watchedList = movies;
            this.watchedList = this.watchedList.filter((m) => {
              return m.watched == true;
            });
            return;
          }
          // console.log('M length : ' + this.watchedList.length);
          console.log(this.watchedList);
          return;
        });
      });
    // this.watchedListervice
    //   .getwatchedList()
    //   .pipe(first())
    //   .subscribe((watchedList) => {
    //     watchedList.map((movie) => {
    //       let obj: any = movie;
    //       if (movie.watched === true) {
    //         this.watchedList.push(movie);
    //       }
    //     });
    //   });
  }

  removeMovie(movie: Movie) {
    let index = this.watchedList.findIndex((d) => d.id === movie.id); //find index in your array
    this.watchedList.splice(index, 1);
  }

  toggleWatched(movie: Movie) {
    this.watchedListervice.toggleWatched(movie);
    this.watchedListervice.Updated.subscribe(() => {
      this.getWatchedList();
    });
  }
}
