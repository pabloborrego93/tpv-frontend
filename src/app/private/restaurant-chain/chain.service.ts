import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';

@Injectable()
export class ChainService {

  constructor(private http: HttpClient) { }

  getUserChain() {
    return this.http
      .get('/api/restaurantChain')
      .pipe(map(
        (response: any) => response,
        (error) => error
      ));
  }

  createChain(chainPostDto) {
    return this.http
    .post('/api/restaurantChain', chainPostDto, { observe: 'response' })
    .toPromise()
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  createRestaurant(restaurantPostDto) {
    return this.http
    .post('/api/restaurant', restaurantPostDto , { observe: 'response' })
    .toPromise()
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

}
