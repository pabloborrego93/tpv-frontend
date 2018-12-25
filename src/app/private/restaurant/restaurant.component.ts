import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { RestaurantService } from './restaurant.service';
import { ToastService } from '../../shared/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  public restaurant: any;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['name'];
  isLoadingResults = false;
  pageSize = 10;
  listLength = 0;
  pageNumber = 0;
  public selected: any;
  @ViewChild('paginator') paginator: MatPaginator;
  private createProductForm: FormGroup;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private toastService: ToastService
  ) {
    this.activateRoute.params.
      subscribe((params) => {
        const name = params['name'];
        this.restaurantService
          .getRestaurant(name)
          .then((res) => {
            this.restaurant = res;
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

  changePage($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadData(page, max_per_page);
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    // this.productService
    //   .list(page, max_per_page)
    //   .then((res: any) => {
    //     const ELEMENT_DATA = res.content;
    //     this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    //     this.pageSize = res.size;
    //     this.listLength = res.totalElements;
    //     this.pageNumber = res.number;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.isLoadingResults = false;
  }

}
