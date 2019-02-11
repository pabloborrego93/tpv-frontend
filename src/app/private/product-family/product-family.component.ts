import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ProductFamilyService } from './product-family.service';
import { NavigationService } from '../navigation/navigation.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-product-family',
  templateUrl: './product-family.component.html',
  styleUrls: ['./product-family.component.scss']
})
export class ProductFamilyComponent implements OnInit, AfterViewInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['name'];
  isLoadingResults = false;
  pageSize = 5;
  listLength = 0;
  pageNumber = 0;
  @ViewChild('paginator') paginator: MatPaginator;

  public selected;

  public formNameRepeated: Boolean = false;
  public loading: Boolean = false;
  public loadingBorrar: Boolean = false;
  private createProductFamilyForm: FormGroup;
  private updateProductFamilyForm: FormGroup;

  ProductFamilyValidationMessages: Object = {
    name: {
      required: 'Name is required!',
      minlength: 'Min length is 2',
      maxlength: 'Max length is 32',
      nameInUse: 'Name already in use'
    }
  };

  constructor(
    private productFamilyService: ProductFamilyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private toastService: ToastService
  ) {
    this.loadData(this.pageNumber, this.pageSize);
  }

  ngOnInit() {
    this.buildCreateProductFamilyForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  toggleSelected(element) {
    if (this.selected && this.selected === element) {
      this.selected = null;
      this.buildCreateProductFamilyForm();
    } else {
      this.selected = element;
      this.buildUpdateProductFamilyForm();
    }
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    this.productFamilyService
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

  buildCreateProductFamilyForm() {
    this.createProductFamilyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      catalogable: [false, [Validators.required]]
    });
  }

  buildUpdateProductFamilyForm() {
    console.log(this.selected);
    this.updateProductFamilyForm = this.formBuilder.group({
      name: [this.selected.name, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      catalogable: [this.selected.catalogable, [Validators.required]]
    });
  }

  changePage($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadData(page, max_per_page);
  }

  updateProductFamily() {
    if (this.isValidForm(this.updateProductFamilyForm)) {
      this.loading = true;
      const name = this.updateProductFamilyForm.value['name'];
      const catalogable = this.updateProductFamilyForm.value['catalogable'];
      setTimeout(() => {
        const productFamilyUpdateDto = {
          'id' : this.selected.id,
          'name' : name,
          'catalogable' : catalogable
        };
        this.productFamilyService
          .update(productFamilyUpdateDto)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            this.selected = null;
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
          });
        this.loading = false;
      }, 500);
    }
  }

  createProductFamily() {
    if (this.isValidForm(this.createProductFamilyForm)) {
      this.loading = true;
      const name = this.createProductFamilyForm.value['name'];
      const catalogable = this.createProductFamilyForm.value['catalogable'];
      setTimeout(() => {
        const productFamilyPostDto = {
          'name' : name,
          'catalogable' : catalogable
        };
        this.productFamilyService
          .create(productFamilyPostDto)
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
  }

  deleteProductFamily() {
    if (this.selected) {
      const name = this.selected;
      this.selected = null;
      this.loadingBorrar = true;
      setTimeout(() => {
        this.productFamilyService
          .delete(name)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            const mensaje = `${name} eliminado correctamente`;
            this.toastService.openSnackBar(mensaje, 3000, 'Cerrar');
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
            const mensaje = `${name} no se pudo eliminar correctamente`;
            this.toastService.openSnackBar(mensaje, 3000, 'Cerrar');
          });
        this.loadingBorrar = false;
      }, 500);
    }
  }

  isValidForm(form) {
    if (this.loading) {
      return false;
    } else {
      return form.valid;
    }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map((str) => + str);
  }

}
