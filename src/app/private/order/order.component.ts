import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from './order.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { RestaurantService } from '../restaurant/restaurant.service';
import { zip } from 'rxjs';
import { ProductService } from '../product/product.service';
import * as _u from 'underscore';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  idRestaurant;

  orders;
  finished: Boolean = false;
  errorLoadingOrders: Boolean = false;
  errorMessage;

  page = 0;
  pageSize = 8;

  config = {
    suppressScrollX: true
  };

  public selected: any;
  public editing: Boolean = false;
  public creating; Boolean = false;

  public zonesGrouped: any[];
  public productsGrouped: any[];

  public zoneType: any[] = [{
    'value': 'TERRACE',
    'viewValue': 'Terraza'
  }, {
    'value': 'BAR',
    'viewValue': 'Bar'
  }, {
    'value': 'LOUNGE',
    'viewValue': 'Salón'
  }];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private activateRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private productService: ProductService
  ) {
    this.activateRoute.params.
      subscribe((params) => {
        this.restartScroll();
        this.idRestaurant = params['id'];
        this.getNextOrders();
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.orders.unsubscribe();
  }

  getAllZones() {
    this.restaurantService.getAllZones(this.idRestaurant, 0, 1000).then((res: any) => {
      this.zonesGrouped = this.groupBy(res.content, 'zoneType', 'zoneType', 'zones');
    });
  }

  getAllProducts() {
    this.productService.catalogablesProductFamilies().then((res: any) => {
      // this.productsGrouped = this.groupBy(res.content, 'families.name', 'families', 'products');
      // this.productsGrouped = _u.groupBy(_u.flatten(_u.pluck(res.content, 'families')), function (item) {
      //   return item;
      // });
      const products = res;
      const byFamilies = products.reduce(function(families, product) {
        product.families.forEach(function(family) {
          const name = family.name;
          const productsByFamilies = families[name] || (families[name] = []);
          productsByFamilies.push(product);
        });
        return families;
      }, {});
      this.productsGrouped = byFamilies;
      this.productsGrouped = _.map(this.productsGrouped, (productList, name) => ({ name, productList }));
      console.log(this.productsGrouped);
    });
  }

  groupBy(dataToGroupOn, fieldNameToGroupOn, fieldNameForGroupName, fieldNameForChildren) {
    const result = _.chain(dataToGroupOn)
      .groupBy(fieldNameToGroupOn)
      .toPairs()
      .map(function (currentItem) {
        return _.zipObject([fieldNameForGroupName, fieldNameForChildren], currentItem);
      })
      .value();
    return result;
  }

  getViewValue(value) {
    const val: any = this.zoneType.filter((v) => v.value === value);
    return val[0].viewValue;
  }

  edit(item) {
    this.getAllZones();
    this.getAllProducts();
    this.editing = true;
    this.selected = item;
  }

  create() {
    this.getAllZones();
    this.getAllProducts();
    this.creating = true;
  }

  restartScroll() {
    this.orders = new BehaviorSubject([]);
    this.page = 0;
    this.finished = false;
  }

  creatingOrEditing() {
    return this.editing || this.creating;
  }

  back() {
    this.creating = false;
    this.editing = false;
    this.restartScroll();
    this.getNextOrders();
  }

  onScroll() {
    console.log('scrolled!!');
    this.page += 1;
    this.getNextOrders();
  }

  getNextOrders() {
    if (!this.finished) {
      this.orderService.list(this.idRestaurant, this.page, this.pageSize)
        .do((orders: any) => {
          if (this.errorLoadingOrders) {
            this.errorLoadingOrders = false;
          }
          if (orders.last) {
            this.finished = true;
          }
          const currentOrders = this.orders.getValue();
          this.orders.next(_.concat(currentOrders, orders.content));
        }, (error: any) => {
          if (error.status === 403) {
            this.errorLoadingOrders = true;
            this.errorMessage = 'No tiene permisos para acceder a los pedidos del restaurante';
          }
          if (error.status === 404) {
            this.errorLoadingOrders = true;
            this.errorMessage = 'No encontrado';
          }
        })
        .take(1)
        .subscribe();
    }
  }

  getErrorMsg() {
    return this.errorMessage;
  }

}
