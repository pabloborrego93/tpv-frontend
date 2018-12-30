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

}
