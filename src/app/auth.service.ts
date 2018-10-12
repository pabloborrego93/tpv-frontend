import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OK_LOGOUT, ERR_LOGOUT } from './app.constants';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) { }

  doLogin(username: string, password: string) {
    const userAndPass: object = {
      'username': username,
      'password': password
    };
    return this.http
      .post('/auth/login', userAndPass)
      .pipe(map(
        (response: any) => {
          if (response && response.access_token) {
            localStorage.setItem('currentUser', JSON.stringify({ username, token: response.access_token }));
          }
        },
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  doRegister(username: String, email: String, password: String, passwordRepeated: String) {
    const registerDto: object = {
      'username': username,
      'email': email,
      'password': password,
      'passwordRepeated': passwordRepeated
    };
    return this.http
      .post('/api/user', registerDto)
      .pipe(map(
        (response: any) => {
          this.doLogin(username.toString(), password.toString());
        },
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  isLogged(): boolean {
    return true;
  }

  doLogOut(mensaje) {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      this.openSnackBar(mensaje, 'Cerrar');
      this.router.navigate(['/home']);
    } else {
      this.openSnackBar(ERR_LOGOUT, 'Cerrar');
      this.router.navigate(['/home']);
    }
  }
  getAuthorizationToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.token;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

}
