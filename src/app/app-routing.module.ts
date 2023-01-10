import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MovieComponent } from './movie/movie.component';
import { RegisterComponent } from './register/register.component';
import { AuthguardGuard } from './services/authguard.guard';
import { WatchedListComponent } from './watched-list/watched-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthguardGuard],
    pathMatch: 'full',
  },
  {
    path: 'movie/:id',
    component: MovieComponent,
    canActivate: [AuthguardGuard],
    pathMatch: 'full',
  },
  {
    path: 'watched',
    component: WatchedListComponent,
    canActivate: [AuthguardGuard],
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: AddMovieComponent,
    canActivate: [AuthguardGuard],
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
