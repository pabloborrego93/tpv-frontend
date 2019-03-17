import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class KitchenService {

  constructor(private http: HttpClient) { }

  list(idRestaurant) {
    const url = `/api/kitchen/${idRestaurant}`;
    return this.http
      .get(url)
      .map((res) => res, (err) => err);
  }

  nextStatus(idKitchenProduct) {
    const url = `/api/kitchen/next/${idKitchenProduct}`;
    return this.http
      .get(url)
      .map((res) => res, (err) => err);
  }

}
