import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ProductFamilyService } from '../product-family/product-family.service';
import { ProductImageCropperComponent } from './product-image-cropper/product-image-cropper.component';
import { ProductService } from './product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../navigation/navigation.service';

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
  pageSize = 10;
  listLength = 0;
  pageNumber = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  private createProductForm: FormGroup;
  private updateProductForm: FormGroup;
  public selected: any;
  public formNameRepeated: Boolean = false;
  public loading: Boolean = false;
  public loadingBorrar: Boolean = false;

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

  public ivaType: any[] = [{
    'value': 'TYPE1',
    'viewValue': '10 %'
  }, {
    'value': 'TYPE2',
    'viewValue': '21 %'
  }];

  public notSelectedFamilies: any[] = [];
  public selectedFamilies: any[] = [];
  public totalProductFamilies: any[] = [];

  public notSelectedProducts: any[] = [];
  public selectedProducts: any[] = [];
  public totalProducts: any[] = [];

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
    public productFamilyService: ProductFamilyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService
  ) {
    this.loadData(this.pageNumber, this.pageSize);
    this.productFamilyService.findAll()
      .subscribe((res: any) => {
        this.totalProductFamilies = res.content;
        this.notSelectedFamilies = this.totalProductFamilies;
      });
    this.loadProductNames();
  }
  ngOnInit() {
    this.setEmptyCroppedImage();
    this.buildCreateProductForm();
  }

  ngAfterViewInit() {
  }

  loadProductNames() {
    this.productService.names().then((res: any) => {
      this.totalProducts = res;
      this.notSelectedProducts = this.totalProducts;
    });
  }

  buildCreateProductForm() {
    this.createProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      price: ['', [Validators.required]],
      iva: ['', [Validators.required]],
      catalogable: [false, [Validators.required]],
      productType: ['SIMPLE', [Validators.required]]
    });
  }

  buildUpdateProductForm(element) {
    this.selected.catalogable = element.catalogable;
    console.log(element);
    this.updateProductForm = this.formBuilder.group({
      id: [element.id, [Validators.required]],
      name: [element.name, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      price: [element.price, [Validators.required]],
      iva: [element.iva, [Validators.required]],
      catalogable: [element.catalogable, [Validators.required]]
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
      this.selectedProducts = [];
      this.notSelectedProducts = this.totalProducts;
      this.croppedImage = 'assets/images/product-without-image.jpeg';
    } else {
      this.selected = element;
      this.selectedFamilies = this.selected.families;
      this.selectedProducts = this.selected.products;
      this.notSelectedFamilies = this.difference(this.selectedFamilies);
      if (this.selected.productType === 'COMPOSITE') {
        this.notSelectedProducts = this.differenceProduct(this.selectedProducts);
      }
      this.buildUpdateProductForm(element);
    }
  }

  createProduct() {
    if (this.isValidForm(this.createProductForm)) {
      this.loading = true;
      const name = this.createProductForm.value['name'];
      const catalogable = this.createProductForm.value['catalogable'];
      const productType = this.createProductForm.value['productType'];
      const price = this.createProductForm.value['price'];
      const iva = this.createProductForm.value['iva'];
      setTimeout(() => {
        const productPostDto = {
          'name': name,
          'catalogable': catalogable,
          'price': price,
          'iva': iva,
          'image': this.croppedImage,
          'productType': productType,
          'productFamilies': this.selectedFamilies,
          'products': this.selectedProducts
        };
        this.productService
          .create(productPostDto)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            this.resetForm(this.createProductForm);
            this.buildCreateProductForm();
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
          });
        this.loading = false;
      }, 500);
    }
  }

  resetForm(form: FormGroup) {
    this.selected = null;
    // form['catalogable'].setValue(false);
    // form.markAsTouched();
    // form.markAsDirty();
    this.selectedFamilies = [];
    this.notSelectedFamilies = this.totalProductFamilies;
    this.selectedProducts = [];
    this.notSelectedProducts = this.totalProducts;
    this.croppedImage = 'assets/images/product-without-image.jpeg';
  }

  updateProduct() {
    if (this.isValidForm(this.updateProductForm)) {
      this.loading = true;
      const name = this.updateProductForm.value['name'];
      const catalogable = this.updateProductForm.value['catalogable'];
      const productType = this.selected.productType;
      const id = this.updateProductForm.value['id'];
      const price = this.updateProductForm.value['price'];
      const iva = this.updateProductForm.value['iva'];
      setTimeout(() => {
        const productUpdateDto = {
          'id': id,
          'name': name,
          'catalogable': catalogable,
          'price': price,
          'iva': iva,
          'image': this.selected.image,
          'productType': productType,
          'productFamilies': this.selectedFamilies,
          'products': this.selectedProducts
        };
        this.productService
          .update(productUpdateDto)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            this.resetForm(this.updateProductForm);
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
          });
        this.loading = false;
      }, 500);
    }
  }

  notSelectedProductsUpdateFilter() {
    return this.notSelectedProducts.filter((product) => product.id !== this.selected.id);
  }

  changePage($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadData(page, max_per_page);
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
    return this.createProductForm && this.createProductForm.get(['productType']).value === 'COMPOSITE';
  }

  showCompositeUpdateForm() {
    return this.updateProductForm && this.selected.productType === 'COMPOSITE';
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

  addToSelectedProduct(selected: any) {
    if (!this.selectedProducts.find((item) => item.id === selected.id)) {
      this.selectedProducts.push(selected);
      this.notSelectedProducts = this.notSelectedProducts.filter((item) => item.id !== selected.id);
    }
  }

  removeFromSelectedProduct(selected: any) {
    this.selectedProducts = this.selectedProducts.filter((item) => item.id !== selected.id);
    if (!this.selectedProducts.find((item) => item.id === selected.id)) {
      this.notSelectedProducts.push(selected);
    }
  }

  isValidForm(form) {
    if (this.loading) {
      return false;
    } else {
      return form.valid;
    }
  }

  difference(selectedProductFamilies: any[]) {
    return this.totalProductFamilies.filter((item) =>
      selectedProductFamilies.filter((it) => it.name.toLowerCase() === item.name.toLowerCase()).length === 0
    );
  }

  differenceProduct(selectedProduct: any[]) {
    return this.totalProducts.filter((item) =>
      selectedProduct.filter((it) => it.id === item.id).length === 0
    );
  }

}
