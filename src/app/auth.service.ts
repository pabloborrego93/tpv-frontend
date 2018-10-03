import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  doLogin(username: string, password: string) {
    const userAndPass: object = {
      'username': username,
      'password': password
    };
    return this.http
      .post('login', userAndPass)
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
      .post('register', registerDto)
      .pipe(map(
        (response: any) => {
          // if (response && response.access_token) {
            // localStorage.setItem('currentUser', JSON.stringify({ username, token: response.access_token }));
          // }
        },
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  isLogged(): boolean {
    return true;
  }

  doLogOut(): Boolean {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      return true;
    } else {
      return false;
    }
  }

  getAuthorizationToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.token;
  }

}