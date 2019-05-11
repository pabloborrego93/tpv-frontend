import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ToastService } from '../../shared/toast.service';
import { NavigationService } from '../navigation/navigation.service';
import { ProductFamilyService } from './product-family.service';
import { ConfirmDeleteProductFamilyComponent } from './confirm-delete-product-family/confirm-delete-product-family.component';

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
  @ViewChild('pfFormRef') formValues: NgForm;

  public selected;

  public formNameRepeated: Boolean = false;
  public loading: Boolean = false;
  public loadingBorrar: Boolean = false;
  public createProductFamilyForm: FormGroup;
  public updateProductFamilyForm: FormGroup;

  ProductFamilyValidationMessages: Object = {
    name: {
      required: 'El nombre es obligatorio',
      minlength: 'La longuitud mínima son 2 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres',
      nameInUse: 'El nombre ya está en uso'
    }
  };

  constructor(
    private productFamilyService: ProductFamilyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private toastService: ToastService,
    public dialog: MatDialog
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
        if (ELEMENT_DATA.length > 0) {
          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
          this.pageSize = res.size;
          this.listLength = res.totalElements;
          this.pageNumber = res.number;
        } else if (page > 0) {
          this.loadData(page - 1, max_per_page);
        } else {
          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
          this.pageSize = res.size;
          this.listLength = res.totalElements;
          this.pageNumber = res.number;
        }
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
            this.toastService.openSnackBar('Actualización correcta', 5000, 'Cerrar');
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

  createProductFamily(pfFormRef: NgForm) {
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
            this.toastService.openSnackBar('Creación correcta', 5000, 'Cerrar');
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            console.log(pfFormRef);
            this.reset(pfFormRef);
          }).catch((err) => {
            if (err.code === 409) {
              this.formNameRepeated = true;
            }
          });
          this.loading = false;
        }, 500);
      }
  }

  // deleteProductFamily() {
  //   if (this.selected) {
  //     const name = this.selected;
  //     this.selected = null;
  //     this.loadingBorrar = true;
  //     setTimeout(() => {
  //       this.productFamilyService
  //         .delete(name)
  //         .then((res) => {
  //           this.navigationService.updateNavigation();
  //           this.loadData(this.pageNumber, this.pageSize);
  //           this.formNameRepeated = false;
  //           this.reset(zoneForm);
  //           const mensaje = `${name.name} eliminado correctamente`;
  //           this.toastService.openSnackBar(mensaje, 5000, 'Cerrar');
  //         }).catch((err) => {
  //           if (err.code === 409) {
  //             this.formNameRepeated = true;
  //           }
  //           const mensaje = `${name.name} no se pudo eliminar correctamente`;
  //           this.toastService.openSnackBar(mensaje, 3000, 'Cerrar');
  //         });
  //       this.loadingBorrar = false;
  //     }, 500);
  //   }
  // }

  openDialog(event, zoneForm) {
    console.log(event);
    const name = event.name;
    console.log(name);
    const dialogRef = this.dialog.open(ConfirmDeleteProductFamilyComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        console.log(name);
        console.log(this.selected.name);
        this.productFamilyService
          .delete(this.selected.name)
          .then((res) => {
            this.navigationService.updateNavigation();
            this.loadData(this.pageNumber, this.pageSize);
            this.formNameRepeated = false;
            this.reset(zoneForm);
            const mensaje = `Eliminado correctamente`;
            this.toastService.openSnackBar(mensaje, 5000, 'Cerrar');
          }).catch((err) => {
            const mensaje = `No se pudo eliminado correctamente`;
            this.toastService.openSnackBar(mensaje, 5000, 'Cerrar');
          });
        }
    });
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

  reset(formRef: NgForm) {
    this.selected = null;
    // this.toggleSelected(null);
    this.buildCreateProductFamilyForm();
    formRef.reset({
      'name': '',
      'catalogable': false
    });
  }

}
