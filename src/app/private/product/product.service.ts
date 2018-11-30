import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  list(pageIndex?, pageSize?) {
    const url = `/api/product/search?page=${pageIndex}&max_per_page=${pageSize}`;
    const object = {
      'name' : '',
      'families' : []
    };
    return this.http
      .post(url, object)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  create(productPostDto) {
    const url = `/api/product`;
    return this.http
      .post(url, productPostDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
