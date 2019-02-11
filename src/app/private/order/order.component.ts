import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OrderService } from './order.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { RestaurantService } from '../restaurant/restaurant.service';
import { zip } from 'rxjs';
import { ProductService } from '../product/product.service';
import * as _u from 'underscore';
import { MatAccordion } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OrderComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  idRestaurant;

  orders;
  finished: Boolean = false;
  errorLoadingOrders: Boolean = false;
  errorMessage;
  zoneSelected: any;

  productLines: any[] = [];
  datasource;

  expandedElement: any;

  page = 0;
  pageSize = 8;

  config = {
    suppressScrollX: true
  };

  displayedColumns: string[] = ['id', 'product', 'amount', 'total'];

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
    private productService: ProductService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.activateRoute.params.
      subscribe((params) => {
        this.restartScroll();
        this.idRestaurant = params['id'];
        this.getNextOrders();
      });
  }

  ngOnInit() {
    this.datasource = new BehaviorSubject([]);
  }

  ngOnDestroy() {
    this.orders.unsubscribe();
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  getAllZones() {
    this.restaurantService.getAllZones(this.idRestaurant, 0, 1000).then((res: any) => {
      this.zonesGrouped = this.groupBy(res.content, 'zoneType', 'zoneType', 'zones');
    });
  }

  getAllProducts() {
    this.productService.catalogablesProductFamilies().then((res: any) => {
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
      this.productsGrouped = _.orderBy(this.productsGrouped, ['name']);
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
    this.zoneSelected = null;
    this.restartScroll();
    this.getNextOrders();
    this.productLines = [];
  }

  onScroll() {
    if (!this.creatingOrEditing()) {
      console.log('scrolled!!');
      this.page += 1;
      this.getNextOrders();
    }
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

  getTotal() {
    let total = 0;
    _.map(this.productLines, (pl) => {
      total += pl.products[0].price * pl.amount;
    });
    return total;
  }

  selectZone(z) {
    this.accordion.closeAll();
    this.zoneSelected = z;
  }

  getErrorMsg() {
    return this.errorMessage;
  }

  addProduct(product) {
    const alreadyExists = _.find(this.productLines, { 'productId': product.id});
    if (!alreadyExists) {
      const productsArray = [];
      productsArray.push(product);
      const pl = {
        'products': productsArray,
        'amount': 1,
        productId: product.id,
      };
      this.productLines.push(pl);
      const rows = [];
      this.productLines.forEach(element => rows.push(element, { detailRow: true, element }));
      this.datasource.next(rows);
    } else {
      alreadyExists.amount += 1;
      alreadyExists.products.push(product);
      const rows = [];
      this.productLines.forEach(element => rows.push(element, { detailRow: true, element }));
      this.datasource.next(rows);
    }
  }

  removeProduct(row) {
    const product = _.find(this.productLines, { 'productId': row.productId});
    if (product.amount === 1) {
      _.remove(this.productLines, { 'productId': row.productId});
      this.datasource.next(this.productLines);
    } else {
      const alreadyExists = _.find(this.productLines, { 'productId': row.productId});
      alreadyExists.amount -= 1;
      this.datasource.next(this.productLines);
    }
  }

}
