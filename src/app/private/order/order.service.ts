import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) { }

  list(idRestaurant, pageIndex?, pageSize?) {
    const url = `/api/order/${idRestaurant}?page=${pageIndex}&max_per_page=${pageSize}`;
    return this.http
      .get(url)
      .map((res) => res);
  }

}
