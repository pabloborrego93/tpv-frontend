import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) { }

  list(orderStatus, idRestaurant, pageIndex?, pageSize?) {
    const url = `/api/order/${idRestaurant}?orderStatus=${orderStatus}&page=${pageIndex}&max_per_page=${pageSize}`;
    return this.http
      .get(url)
      .map((res) => res, (err) => err);
  }

  create(idZone, products: any[]) {
    const url = `/api/order/create/${idZone}`;
    return this.http
      .post(url, products)
      .map((res) => res, (err) => err);
  }

  update(idOrder, products: any[]) {
    const url = `/api/order/update/${idOrder}`;
    return this.http
      .post(url, products)
      .map((res) => res, (err) => err);
  }

  close(idOrder) {
    const url = `/api/order/close/${idOrder}`;
    return this.http
      .get(url)
      .map((res) => res, (err) => err);
  }

}
