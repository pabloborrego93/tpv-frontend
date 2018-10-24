import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getRestaurant(name: string) {
      const url = `/api/restaurant?name=${encodeURIComponent(name)}`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
