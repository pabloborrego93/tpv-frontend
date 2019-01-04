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

  getAllUsers() {
    const url = `/api/restaurantChain/user`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  getAllWorkers(idRestaurant) {
    const url = `/api/restaurant/${idRestaurant}/workers`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  updateZone(idRestaurant, zoneUpdateDto) {
    const url = `/api/restaurant/${idRestaurant}/zone`;
    return this.http
      .put(url, zoneUpdateDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  deleteZone(idRestaurant, zoneDto) {
    const url = `/api/restaurant/${idRestaurant}/zone/${zoneDto.id}`;
    return this.http
      .delete(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  postZone(idRestaurant, zoneDto) {
    const url = `/api/restaurant/${idRestaurant}/zone`;
    return this.http
      .post(url, zoneDto)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  getAllZones(idRestaurant, pageIndex?, pageSize?) {
    const url = `/api/restaurant/${idRestaurant}/zones?page=${pageIndex}&max_per_page=${pageSize}`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  setAllWorkers(idRestaurant, workers) {
    const url = `/api/restaurant/${idRestaurant}/workers`;
    return this.http
      .post(url, workers)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
