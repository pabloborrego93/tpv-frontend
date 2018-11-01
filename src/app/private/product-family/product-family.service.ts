import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductFamilyService {

  constructor(private http: HttpClient) { }

  create(productFamilyPostDto) {
    const url = `/api/productFamily`;
    return this.http
      .post(url, productFamilyPostDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  update(productFamilyUpdateDto) {
    const url = `/api/productFamily`;
    return this.http
      .put(url, productFamilyUpdateDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  delete(name) {
    const url = `/api/productFamily?name=${name}`;
    return this.http
      .delete(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  list(pageIndex?, pageSize?) {
    const url = `/api/productFamily?page=${pageIndex}&max_per_page=${pageSize}`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
