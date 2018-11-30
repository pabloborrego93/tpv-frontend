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
  pageSize = 5;
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

  public notSelectedFamilies: any[] = [];
  public selectedFamilies: any[] = [];
  public totalProductFamilies: any[] = [];

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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      catalogable: [false, [Validators.required]],
      productType: ['SIMPLE', [Validators.required]]
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

  createProduct() {
    if (this.isValidForm(this.createProductForm)) {
      this.loading = true;
      const name = this.createProductForm.value['name'];
      const catalogable = this.createProductForm.value['catalogable'];
      const productType = this.createProductForm.value['productType'];
      setTimeout(() => {
        const productPostDto = {
          'name' : name,
          'catalogable': catalogable,
          'image': this.croppedImage,
          'productType': productType,
          'productFamilies': this.selectedFamilies
        };
        this.productService
          .create(productPostDto)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
          });
          this.loading = false;
        }, 500);
      }
      this.createProductForm.reset();
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

}
