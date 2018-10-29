import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public products: any[] = [];

  public productTypes: any[] = [{
    'value' : 'PRODUCT_SIMPLE',
    'viewValue' : 'Producto Simple'
  }, {
    'value' : 'PRODUCT_COMPOSITE',
    'viewValue' : 'Producto Compuesto'
  }];

  public notSelectedFamilies: string[] = [
    'Bebidas',
    'Panes',
    'Pizzas',
    'Hamburguesas'
  ];

  public selectedFamilies: string[] = [
    'Bebidas2',
    'Pizzas2'
  ];

  public selected: any;

  constructor() { }

  ngOnInit() {
  }

  showCompositeForm() {
    return this.selected && this.selected === 'PRODUCT_COMPOSITE';
  }

  addToSelected(selected: string) {
    if (!this.selectedFamilies.find((item) => item.toLowerCase() === selected.toLowerCase())) {
      this.selectedFamilies.push(selected);
      this.notSelectedFamilies = this.notSelectedFamilies.filter((item) => item.toLowerCase() !== selected.toLowerCase());
    }
  }

  removeFromSelected(selected: string) {
    this.selectedFamilies = this.selectedFamilies.filter((item) => item.toLowerCase() !== selected.toLowerCase());
    if (!this.selectedFamilies.find((item) => item.toLowerCase() === selected.toLowerCase())) {
      this.notSelectedFamilies.push(selected);
    }
  }

}
