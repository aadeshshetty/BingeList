import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/home']);
      },
      (err) => {
        alert('Something went wrong');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    );
  }
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(
      () => {
        alert('Register Successfull');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert('Something went wrong');
        this.router.navigate(['/register']);
      }
    );
  }

  logout() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert('Something went wrong');
        console.log(err.message);
      }
    );
  }
}
