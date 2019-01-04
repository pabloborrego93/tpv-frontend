import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';
import { RestaurantService } from './restaurant.service';
import { ConfirmDeleteZoneComponent } from './confirm-delete-zone/confirm-delete-zone.component';

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
  public loading: Boolean = false;

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
  private zoneForm: FormGroup;

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
    private activateRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
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
            this.getUsersAndWorkers();
            this.loadData(this.pageNumber, this.pageSize);
            this.buildZoneForm();
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

  compareZoneFn(a, b) {
    return a && b && a.value === b;
  }

  buildWorkersForm() {
    this.workersForm = this.formBuilder.group({
      workers: [this.workers]
    });
  }

  openDialog(event, zoneForm) {
    const dialogRef = this.dialog.open(ConfirmDeleteZoneComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaurantService.deleteZone(this.restaurant.id, this.selected).then((res) => {
          this.reset(zoneForm);
          this.loadData(this.pageNumber, this.pageSize);
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

  getUsersAndWorkers() {
    this.restaurantService.getAllUsers().then((res) => {
      this.users = res;
      this.restaurantService.getAllWorkers(this.restaurant.id).then((result) => {
        this.workers = result;
        this.buildWorkersForm();
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

          this.loading = false;
        }).catch((err) => {

          this.loading = false;
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

  toggleSelected(element) {
    if (this.selected && this.selected === element) {
      this.selected = null;
      this.buildZoneForm();
    } else {
      this.selected = element;
      this.buildZoneForm();
    }
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    this.restaurantService
      .getAllZones(this.restaurant.id, page, max_per_page)
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

}
