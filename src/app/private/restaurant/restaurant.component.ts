import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';
import { NavigationService } from '../navigation/navigation.service';
import { ConfirmDeleteZoneComponent } from './confirm-delete-zone/confirm-delete-zone.component';
import { RestaurantService } from './restaurant.service';
import { ConfirmDeletePrinterComponent } from './confirm-delete-printer/confirm-delete-printer.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit, AfterViewInit {

  public restaurant: any;
  public users: any;
  public workers: any;
  public workersForm: FormGroup;
  public screens: any;
  public screensForm: FormGroup;
  public loading: Boolean = false;
  public loadingSC: Boolean = false;

  // Zone
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['zoneType', 'description'];
  isLoadingResults = false;
  pageSize = 10;
  listLength = 0;
  pageNumber = 0;
  public selected: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('zoneFormRef') formValues: NgForm;
  public zoneForm: FormGroup;

  //  Printer
  pageEventPrinter: PageEvent;
  dataSourcePrinter = new MatTableDataSource<Element>();
  displayedColumnsPrinter: string[] = ['name', 'printerid', 'defaultPrinter'];
  pageSizePrinter = 10;
  listLengthPrinter = 0;
  pageNumberPrinter = 0;
  public selectedPrinter: any;
  @ViewChild('paginatorPrinter') paginatorPrinter: MatPaginator;
  @ViewChild('printerFormRef') formValuesPrinter: NgForm;
  public printerForm: FormGroup;

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

  validationZoneMessages: Object = {
    zoneType: {
      required: 'El tipo de zona es obligatorio',
    },
    description: {
      required: 'La descripción es obligatoria',
      minlength: 'La longuitud mínima son 2 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres'
    }
  };

  validationPrinterMessages: Object = {
    name: {
      required: 'El nombre es obligatorio',
      minlength: 'La longuitud mínima son 4 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres',
    },
    printerid: {
      required: 'El ID de Google Cloud Print es obligatorio',
      minlength: 'La longuitud mínima son 4 caracteres',
      maxlength: 'La longuitud máxima son 36 caracteres'
    }
  };

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private navigationService: NavigationService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.activateRoute.params.
      subscribe((params) => {
        const name = params['name'];
        this.restaurantService
          .getRestaurant(name)
          .then((res) => {
            this.restaurant = res;
            this.getUsersAndWorkersAndScreens();
            this.loadData(this.pageNumber, this.pageSize);
            this.loadDataPrinter(this.pageNumberPrinter, this.pageSizePrinter);
            this.buildZoneForm();
            this.buildPrinterForm();
          })
          .catch((err) => {
            console.log('error' + err);
            if (err.code === 404) {
              this.toastService.openSnackBar('Restaurante no encontrado', 3000, 'Cerrar');
              this.router.navigate(['/admin/chain']);
            }
          });
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  getViewValue(value) {
    const val: any = this.zoneType.filter((v) => v.value === value);
    return val[0].viewValue;
  }

  isValidForm(form) {
    if (this.loading) {
      return false;
    } else {
      return form.valid;
    }
  }

  isValidFormSC(form) {
    if (this.loadingSC) {
      return false;
    } else {
      return form.valid;
    }
  }

  compareZoneFn(a, b) {
    return a && b && a.value === b;
  }

  buildWorkersForm() {
    this.workersForm = this.formBuilder.group({
      workers: [this.workers]
    });
  }

  buildScreensForm() {
    this.screensForm = this.formBuilder.group({
      screens: [this.screens]
    });
  }

  openDialog(event, zoneForm) {
    const dialogRef = this.dialog.open(ConfirmDeleteZoneComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaurantService.deleteZone(this.restaurant.id, this.selected).then((res) => {
          this.loadData(this.pageNumber, this.pageSize);
          this.reset(zoneForm);
        });
      }
    });
  }

  openDialogPrinter(event, printerForm) {
    const dialogRef = this.dialog.open(ConfirmDeletePrinterComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaurantService.deletePrinter(this.restaurant.id, this.selectedPrinter).then((res) => {
          this.resetPrinter(printerForm);
          this.loadDataPrinter(this.pageNumberPrinter, this.pageSizePrinter);
        });
      }
    });
  }

  reset(zoneFormRef: NgForm) {
    this.toggleSelected(null);
    zoneFormRef.reset({
      'zoneType': '',
      'description': ''
    });
  }

  resetPrinter(printerFormRef: NgForm) {
    this.toggleSelectedPrinter(null);
    printerFormRef.reset({
      'name': '',
      'printerid': '',
      'defaultPrinter': false
    });
  }

  buildZoneForm() {
    if (this.selected) {
      this.zoneForm = this.formBuilder.group({
        zoneType: [this.selected.zoneType, [Validators.required]],
        description: [this.selected.description, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]]
      });
    } else {
      this.zoneForm = this.formBuilder.group({
        zoneType: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]]
      });
    }
  }

  buildPrinterForm() {
    if (this.selectedPrinter) {
      this.printerForm = this.formBuilder.group({
        name: [this.selectedPrinter.name, Validators.minLength(4), Validators.maxLength(16)],
        printerid: [this.selectedPrinter.printerid, [Validators.required, Validators.minLength(4), Validators.maxLength(36)]],
        defaultPrinter: [this.selectedPrinter.defaultPrinter, [Validators.required]]
      });
    } else {
      this.printerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        printerid: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(36)]],
        defaultPrinter: [false, [Validators.required]]
      });
    }
  }

  getUsersAndWorkersAndScreens() {
    this.restaurantService.getAllUsers().then((res) => {
      this.users = res;
      this.restaurantService.getAllWorkers(this.restaurant.id).then((result) => {
        this.workers = result;
        this.buildWorkersForm();
      });
      this.restaurantService.getAllScreens(this.restaurant.id).then((result) => {
        this.screens = result;
        this.buildScreensForm();
      });
    });
  }

  submitZone(zoneFormRef: NgForm) {
    if (this.selected) {
      // updating
      if (this.isValidForm(this.zoneForm)) {
        this.loading = true;
        const id = this.selected.id;
        const zoneType = this.zoneForm.value['zoneType'];
        const description = this.zoneForm.value['description'];
        setTimeout(() => {
          const zoneUpdateDto = {
            'id': id,
            'zoneType': zoneType,
            'description': description
          };
          this.restaurantService
            .updateZone(this.restaurant.id, zoneUpdateDto)
            .then((res) => {
              this.loadData(this.pageNumber, this.pageSize);
              this.reset(zoneFormRef);
              this.toastService.openSnackBar('Actualización correcta', 5000, 'Cerrar');
            }).catch((err) => {
              if (err.code === 409) {
              }
            });
          this.loading = false;
        }, 500);
      }
    } else {
      // creating
      if (this.isValidForm(this.zoneForm)) {
        this.loading = true;
        const zoneType = this.zoneForm.value['zoneType'];
        const description = this.zoneForm.value['description'];
        setTimeout(() => {
          const zonePostDto = {
            'zoneType': zoneType,
            'description': description
          };
          this.restaurantService
            .postZone(this.restaurant.id, zonePostDto)
            .then((res) => {
              this.loadData(this.pageNumber, this.pageSize);
              this.reset(zoneFormRef);
              this.toastService.openSnackBar('Creación correcta', 5000, 'Cerrar');
            }).catch((err) => {
              if (err.code === 409) {
              }
            });
          this.loading = false;
        }, 500);
      }
    }
  }

  submitPrinter(printerFormRef: NgForm) {
    if (this.selectedPrinter) {
      // updating
      if (this.isValidForm(this.printerForm)) {
        this.loading = true;
        const id = this.selectedPrinter.id;
        const name = this.printerForm.value['name'];
        const printerid = this.printerForm.value['printerid'];
        const defaultPrinter = this.printerForm.value['defaultPrinter'];
        setTimeout(() => {
          const printerUpdateDto = {
            'id': id,
            'name': name,
            'printerid': printerid,
            'defaultPrinter': defaultPrinter
          };
          this.restaurantService
            .updatePrinter(this.restaurant.id, printerUpdateDto)
            .then((res) => {
              this.loadDataPrinter(this.pageNumberPrinter, this.pageSizePrinter);
              this.resetPrinter(printerFormRef);
              this.toastService.openSnackBar('Actualización correcta', 5000, 'Cerrar');
            }).catch((err) => {
              if (err.code === 409) {
              }
            });
          this.loading = false;
        }, 500);
      }
    } else {
      // creating
      if (this.isValidForm(this.printerForm)) {
        this.loading = true;
        const name = this.printerForm.value['name'];
        const printerid = this.printerForm.value['printerid'];
        const defaultPrinter = this.printerForm.value['defaultPrinter'];
        setTimeout(() => {
          const printerPostDto = {
            'name': name,
            'printerid': printerid,
            'defaultPrinter': defaultPrinter
          };
          this.restaurantService
            .postPrinter(this.restaurant.id, printerPostDto)
            .then((res) => {
              this.loadDataPrinter(this.pageNumber, this.pageSize);
              this.resetPrinter(printerFormRef);
              this.toastService.openSnackBar('Creación correcta', 5000, 'Cerrar');
            }).catch((err) => {
              if (err.code === 409) {
              }
            });
          this.loading = false;
        }, 500);
      }
    }
  }

  submitWorkers(value) {
    this.loading = true;
    setTimeout(() => {
      this.restaurantService.setAllWorkers(this.restaurant.id, value.workers)
        .then((res) => {
          this.toastService.openSnackBar('Actualización correcta', 5000, 'Cerrar');
          this.navigationService.updateNavigation();
          this.loading = false;
        }).catch((err) => {
          this.toastService.openSnackBar('Se ha producido un error al actualizar', 5000, 'Cerrar');
          this.loading = false;
        });
    }, 500);
  }

  submitScreens(value) {
    this.loadingSC = true;
    setTimeout(() => {
      this.restaurantService.setAllScreens(this.restaurant.id, value.screens)
        .then((res) => {
          this.toastService.openSnackBar('Actualización correcta', 5000, 'Cerrar');
          this.navigationService.updateNavigation();
          this.loadingSC = false;
        }).catch((err) => {
          this.toastService.openSnackBar('Se ha producido un error al actualizar', 5000, 'Cerrar');
          this.loadingSC = false;
        });
    }, 500);
  }

  compareFn(a, b) {
    return a && b && a.id === b.id;
  }

  changePage($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadData(page, max_per_page);
  }

  changePagePrinter($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadDataPrinter(page, max_per_page);
  }

  toggleSelected(element) {
    if (this.selected && this.selected === element) {
      this.selected = null;
      this.buildZoneForm();
    } else {
      this.selected = element;
      this.buildZoneForm();
    }
  }

  toggleSelectedPrinter(element) {
    if (this.selectedPrinter && this.selectedPrinter === element) {
      this.selectedPrinter = null;
      this.buildPrinterForm();
    } else {
      this.selectedPrinter = element;
      this.buildPrinterForm();
    }
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    this.restaurantService
      .getAllZones(this.restaurant.id, page, max_per_page)
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

  loadDataPrinter(page, max_per_page) {
    this.isLoadingResults = true;
    this.restaurantService
      .getAllPrinters(this.restaurant.id, page, max_per_page)
      .then((res: any) => {
        const ELEMENT_DATA = res.content;
        if (ELEMENT_DATA.length > 0) {
          this.dataSourcePrinter = new MatTableDataSource<Element>(ELEMENT_DATA);
          this.pageSizePrinter = res.size;
          this.listLengthPrinter = res.totalElements;
          this.pageNumberPrinter = res.number;
        } else if (page > 0) {
          this.loadDataPrinter(page - 1, max_per_page);
        } else {
          this.dataSourcePrinter = new MatTableDataSource<Element>(ELEMENT_DATA);
          this.pageSizePrinter = res.size;
          this.listLengthPrinter = res.totalElements;
          this.pageNumberPrinter = res.number;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.isLoadingResults = false;
  }

}
