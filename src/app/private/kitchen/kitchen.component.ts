import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitchenService } from './kitchen.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  idRestaurant;
  kitchenProducts;

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

  getKitchenProducts() {
    this.kitchenService.list(this.idRestaurant)
      .subscribe((res) => {
        this.kitchenProducts = res;
        setTimeout(() => {
          this.getKitchenProducts();
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
