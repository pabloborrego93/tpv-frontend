import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MyProfileService {

  constructor(private http: HttpClient) { }

  getCurrentUserInfo() {
    return this.http
      .get('/api/user')
      .pipe(map(
        (response: any) => response,
        (error) => {
          console.log('No se pudo hacer login');
        }
      ));
  }

  updateUserInfo(updateUserDto: Object) {
    return this.http
      .put('/api/user', updateUserDto)
      .pipe(map(
        (response: any) => response,
        (error) => {
          console.log('No se pudo hacer el post');
        }
      ));
  }

}
