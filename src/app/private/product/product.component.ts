import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ProductFamilyService } from '../product-family/product-family.service';
import { ProductImageCropperComponent } from './product-image-cropper/product-image-cropper.component';
import { ProductService } from './product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['image', 'name'];
  isLoadingResults = false;
  pageSize = 5;
  listLength = 0;
  pageNumber = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  private createProductForm: FormGroup;
  private updateProductForm: FormGroup;
  public selected: any;

  @ViewChild('imgFileInput')
  fileInput: ElementRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  public productTypes: any[] = [{
    'value': 'SIMPLE',
    'viewValue': 'Producto Simple'
  }, {
    'value': 'COMPOSITE',
    'viewValue': 'Producto Compuesto'
  }];

  public notSelectedFamilies: any[] = [];
  public selectedFamilies: any[] = [];
  public totalProductFamilies: any[] = [];

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
    public productFamilyService: ProductFamilyService,
    private formBuilder: FormBuilder
  ) {
    this.loadData(this.pageNumber, this.pageSize);
    this.productFamilyService.findAll()
      .subscribe((res: any) => {
        this.totalProductFamilies = res.content;
        this.notSelectedFamilies = this.totalProductFamilies;
      });
  }
  ngOnInit() {
    this.setEmptyCroppedImage();
    this.buildCreateProductForm();
    this.buildUpdateProductForm();
  }

  ngAfterViewInit() {
  }

  buildCreateProductForm() {
    this.createProductForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
    });
  }

  buildUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
    });
  }

  openDialog(event) {
    const dialogRef = this.dialog.open(ProductImageCropperComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.selected) {
          this.selected.image = result;
        } else {
          this.croppedImage = result;
        }
      }
      this.imageChangedEvent = null;
      this.fileInput.nativeElement.value = '';
    });
  }

  toggleSelected(element) {
    if (this.selected && this.selected === element) {
      this.selected = null;
      this.selectedFamilies = [];
      this.notSelectedFamilies = this.totalProductFamilies;
    } else {
      this.selected = element;
      this.selectedFamilies = this.selected.families;
      this.notSelectedFamilies = this.difference(this.selectedFamilies);
    }
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    this.productService
      .list(page, max_per_page)
      .then((res: any) => {
        const ELEMENT_DATA = res.content;
        this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
        this.pageSize = res.size;
        this.listLength = res.totalElements;
        this.pageNumber = res.number;
      })
      .catch((err) => {
        console.log(err);
      });
    this.isLoadingResults = false;
  }

  fileChangeEvent(event) {
    this.openDialog(event);
  }

  setEmptyCroppedImage() {
    if (this.selected) {
      this.selected.image = 'assets/images/product-without-image.jpeg';
    } else {
      this.croppedImage = 'assets/images/product-without-image.jpeg';
    }
  }

  showCompositeForm() {
    return this.selected && this.selected === 'PRODUCT_COMPOSITE';
  }

  addToSelected(selected: any) {
    if (!this.selectedFamilies.find((item) => item.name.toLowerCase() === selected.name.toLowerCase())) {
      this.selectedFamilies.push(selected);
      this.notSelectedFamilies = this.notSelectedFamilies.filter((item) => item.name.toLowerCase() !== selected.name.toLowerCase());
    }
  }

  removeFromSelected(selected: any) {
    this.selectedFamilies = this.selectedFamilies.filter((item) => item.name.toLowerCase() !== selected.name.toLowerCase());
    if (!this.selectedFamilies.find((item) => item.name.toLowerCase() === selected.name.toLowerCase())) {
      this.notSelectedFamilies.push(selected);
    }
  }

  difference(selectedProductFamilies: any[]) {
    return this.totalProductFamilies.filter((item) =>
      selectedProductFamilies.filter((it) => it.name.toLowerCase() === item.name.toLowerCase()).length === 0
    );
  }

  // difference(selectedProductFamilies: any[]) {
  //   const set = new Set([...selectedProductFamilies, ...this.totalProductFamilies]);
  //   // set.add(selectedProductFamilies.values);
  //   console.log(set);
  //   // set.add(this.totalProductFamilies.values);
  //   // console.log(set);
  //   return Array.from(set);
  // }

}
