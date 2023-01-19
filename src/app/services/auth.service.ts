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
        let temp = '' + err;
        console.log(temp);

        alert(temp.split('.').at(0));
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

  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(
      () => {
        alert('Password sent email is sent');
      },
      (err) => {
        alert('something went wrong');
      }
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token == 'true') {
      return true;
    }
    return false;
  }
}
