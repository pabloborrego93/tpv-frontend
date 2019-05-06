import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitchenService } from './kitchen.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit, OnDestroy {

  idRestaurant;
  kitchenProducts;
  keepFetching = true;

  constructor(
    private activateRoute: ActivatedRoute,
    private kitchenService: KitchenService
  ) { }

  ngOnInit() {
    this.activateRoute.params.
      subscribe((params) => {
        this.idRestaurant = params['id'];
        this.getKitchenProducts();
      });
  }

  ngOnDestroy() {
    this.keepFetching = false;
  }

  getKitchenProducts() {
    this.kitchenService.list(this.idRestaurant)
      .subscribe((res) => {
        this.kitchenProducts = res;
        setTimeout(() => {
          if (this.keepFetching) {
            this.getKitchenProducts();
          }
        }, 10000);
      });
  }

  getKitchenProductsOne() {
    this.kitchenService.list(this.idRestaurant)
      .subscribe((res) => {
        this.kitchenProducts = res;
      });
  }

  getKitchenProductsFiltered(status) {
    return _.filter(this.kitchenProducts, {'status': status});
  }

  nextStatus(idKitchenProduct) {
    this.kitchenService.nextStatus(idKitchenProduct).subscribe((res) => {
      this.getKitchenProductsOne();
    });
  }

}
