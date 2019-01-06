import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from './order.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  idRestaurant;

  orders;
  finished: Boolean = false;

  page = 0;
  pageSize = 10;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.params.
      subscribe((params) => {
        this.orders = new BehaviorSubject([]);
        this.page = 0;
        this.finished = false;
        this.idRestaurant = params['id'];
        this.getNextOrders();
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.orders.unsubscribe();
  }

  onScroll () {
    console.log('scrolled!!');
    this.page += 1;
    this.getNextOrders();
  }

  getNextOrders() {
    if (!this.finished) {
      this.orderService.list(this.idRestaurant, this.page, this.pageSize)
      .do((orders: any) => {
        if (orders.last) {
          this.finished = true;
        }
        const currentOrders = this.orders.getValue();
        this.orders.next(_.concat(currentOrders, orders.content));
      })
      .take(1)
      .subscribe();
    }
  }

}
