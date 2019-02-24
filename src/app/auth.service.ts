import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OK_LOGOUT, ERR_LOGOUT } from './app.constants';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UserComponent } from './private/user/user.component';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  currentUser: any;

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) { }

  doLogin(username: string, password: string, loginId?: string) {
    const userAndPass: object = {
      'username': username,
      'password': password,
      'chainId': loginId
    };
    return this.http
      .post('/auth/login', userAndPass)
      .pipe(map(
        (response: any) => {
          if (response && response.access_token) {
            localStorage.setItem('currentUser', JSON.stringify({ username, token: response.access_token }));
            this.getCurrentUserInfo();
          }
        },
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  getCurrentUserInfo() {
    return this.http
      .get('/api/user')
      .pipe(map(
        (response: any) => this.currentUser = response,
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserInfo() {
    return this.http
    .get('/api/user')
    .map((res) => res);
  }

  doRegister(registerDto) {
    return this.http
      .post('/api/user', registerDto)
      .pipe(map(
        (response: any) => response,
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

  getRestaurantChainName(id) {
    const url = `/api/restaurantChain/getById`;
    const params: HttpParams = new HttpParams().set('id', id);
    return this.http
      .get(url, { params })
      .pipe(
        map((res) => res, (err) => err)
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

}
