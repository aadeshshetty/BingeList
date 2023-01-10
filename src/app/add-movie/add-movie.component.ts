import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
})
export class AddMovieComponent implements OnInit {
  movies: Movie[] = [];
  movie!: FormGroup;
  now: Date = new Date();
  imdbInfo: any;
  omdbInfo: any;
  id: number = 0;
  constructor(
    private movieService: MovieService,
    private router: Router,
    private datepipe: DatePipe
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.movieService.getMovies()!.subscribe((moviesList) => {
      moviesList.map((movie, index) => {
        let obj: any = moviesList[index];
        let key = Object.keys(obj);
      });
      const len = this.movies.length;
      this.id += 1;
      console.log(this.id);

      this.movie.patchValue({ id: Math.random().toString(36).slice(2) });
      // console.log(obj);
      // console.log(obj[key[0]]);
    });
  }

  createForm() {
    let today = this.datepipe.transform(this.now, 'yyyy-MM-dd');
    this.movie = new FormGroup({
      title: new FormControl(''),
      imdbId: new FormControl(''),
      // year: new FormControl(null),
      year: new FormControl(),
      description: new FormControl(''),
      // image: new FormControl(''),
      image: new FormControl(''),
      watched: new FormControl(''),
      dateWatched: new FormControl(today),
      releaseDate: new FormControl(''),
      liked: new FormControl(),
      runtime: new FormControl(''),
      tags: new FormArray([]),
      id: new FormControl(),
      ratings: new FormControl([]),
      genres: new FormControl(),
      director: new FormControl(),
    });
  }

  get tags(): FormArray {
    return this.movie.get('tags') as FormArray;
  }

  genTag(): FormControl {
    return new FormControl('');
  }

  addTag() {
    this.tags.push(this.genTag());
  }

  removeTag(i: number) {
    this.tags.removeAt(i);
  }
  getData(movieInfo: any) {
    this.movie.patchValue({ image: movieInfo.Poster });
    this.movie.patchValue({ year: movieInfo.Year });
    this.movie.patchValue({ releaseDate: movieInfo.Released });
    this.movie.patchValue({ runtime: movieInfo.Runtime });
    this.movie.patchValue({ genres: movieInfo.Genre });
    this.movie.patchValue({ description: movieInfo.Plot });
    this.movie.patchValue({ director: movieInfo.Director });
    this.movie.patchValue({ ratings: movieInfo.Ratings });
    // console.log(this.movie.valid);
    this.movieService.addMovie(this.movie.value);
    alert('movie added to list');
    this.router.navigate(['/home']);
  }
  submit() {
    let arr: string[] = this.tags.value;
    if (this.movie.get('imdbId')?.value !== '') {
      // console.log(this.movie.value);
      this.movieService
        .getomdbInfo(this.movie.get('imdbId')?.value)
        .subscribe((info) => {
          this.omdbInfo = info;
          this.getData(info);
        });
    } else {
      this.movieService
        .getimdbInfo(this.movie.value)
        .pipe()
        .subscribe((movie) => {
          this.imdbInfo = movie;
          this.movie.patchValue({ image: this.imdbInfo.d.at(0).i.imageUrl });
          this.movie.patchValue({ year: this.imdbInfo.d.at(0).y });
          this.movieService
            .getomdbInfo(this.imdbInfo.d.at(0).id)
            .subscribe((info) => {
              this.omdbInfo = info;
              console.log(info);
              this.getData(info);
            });
        });
    }
  }
}
