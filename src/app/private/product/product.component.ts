import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProductImageCropperComponent } from './product-image-cropper/product-image-cropper.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  @ViewChild('imgFileInput')
  fileInput: ElementRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  public products: any[] = [];

  public productTypes: any[] = [{
    'value': 'PRODUCT_SIMPLE',
    'viewValue': 'Producto Simple'
  }, {
    'value': 'PRODUCT_COMPOSITE',
    'viewValue': 'Producto Compuesto'
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

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.setEmptyCroppedImage();
  }

  ngAfterViewInit() {
  }

  openDialog(event) {
    const dialogRef = this.dialog.open(ProductImageCropperComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.croppedImage = result;
      }
      this.imageChangedEvent = null;
      this.fileInput.nativeElement.value = '';
    });
  }

  fileChangeEvent(event) {
    this.openDialog(event);
  }

  setEmptyCroppedImage() {
    this.croppedImage = 'assets/images/product-without-image.jpeg';
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
