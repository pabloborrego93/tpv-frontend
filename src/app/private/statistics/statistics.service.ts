import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private baseUrl = `/api/statistics`;

  constructor(private http: HttpClient) { }

  getEarnings() {
    const url = `${this.baseUrl}/earnings`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

  getOrders() {
    const url = `${this.baseUrl}/orders`;
    return this.http
      .get(url)
      .toPromise()
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));
  }

}
