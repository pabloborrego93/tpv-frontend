import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  list(pageIndex?, pageSize?) {
    const url = `/api/user/search?page=${pageIndex}&max_per_page=${pageSize}`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  create(userPostDto) {
    const url = `/api/restaurantChain/user`;
    return this.http
      .post(url, userPostDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  update(userUpdateDto) {
    const url = `/api/restaurantChain/user`;
    return this.http
      .put(url, userUpdateDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  delete(id) {
    const url = `/api/restaurantChain/user`;
    const params: HttpParams = new HttpParams().set('id', id);
    return this.http
      .delete(url, { params })
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
