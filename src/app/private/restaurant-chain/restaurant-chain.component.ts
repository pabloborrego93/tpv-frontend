import { Component, OnInit } from '@angular/core';
import { ChainService } from './chain.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-restaurant-chain',
  templateUrl: './restaurant-chain.component.html',
  styleUrls: ['./restaurant-chain.component.scss']
})
export class RestaurantChainComponent implements OnInit {

  public chain: any;
  public chainLoaded: boolean = false;
  public formNameRepeated: Boolean = false;
  public loading: Boolean = false;
  public loadingCR: Boolean = false;
  private createChainForm: FormGroup;
  private createRestaurantForm: FormGroup;

  chainValidationMessages: Object = {
    name: {
      required: 'Name is required!',
      minlength: 'Min length is 2',
      maxlength: 'Max length is 16',
      nameInUse: 'Name already in use'
    }
  };

  restaurantValidationMessages: Object = {
    name: {
      required: 'Name is required!',
      minlength: 'Min length is 2',
      maxlength: 'Max length is 16',
      nameInUse: 'Name already in use'
    },
    address: {
      required: 'Address is required!',
      minlength: 'Min length is 2',
      maxlength: 'Max length is 16'
    }
  };

  constructor(
    private chainService: ChainService,
    private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.chain = this.chainService
      .getUserChain()
      .subscribe((res) => {
        this.chain = res;
        this.chainLoaded = true;
        if (this.chain) {
          this.buildCreateChainForm();
          this.buildCreateRestaurantForm();
        }
      }, (err) => console.log(err)
    );
  }

  buildCreateChainForm() {
    this.createChainForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
    });
  }

  buildCreateRestaurantForm() {
    this.createRestaurantForm = this.formBuilder2.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]]
    });
  }

  createRestaurant() {
    if (this.isValidForm(this.createRestaurantForm)) {
      this.loadingCR = true;
      const name = this.createRestaurantForm.value['name'];
      const address = this.createRestaurantForm.value['address'];
      setTimeout(() => {
        const restaurantPostDto = {
          'name' : name,
          'address' : address
        };
        this.chainService
          .createRestaurant(restaurantPostDto)
          .then((res) => {
            this.navigationService.updateNavigation();
          }).catch((err) => {
            if (err.error.code === 409) {
              this.formNameRepeated = true;
            }
          });
        this.loadingCR = false;
      }, 500);
    }
  }

  createChain() {
    if (this.isValidForm(this.createChainForm)) {
      this.loading = true;
      const name = this.createChainForm.value['name'];
      setTimeout(() => {
        const chainPostDto = {
          'name' : name
        };
        this.chainService
          .createChain(chainPostDto)
          .then((res) => {
            this.chain = res;
            this.navigationService.updateNavigation();
            this.buildCreateRestaurantForm();
          }).catch((err) => {
            if (err.error.code === 409) {
              this.formNameRepeated = true;
            }
          });
        this.loading = false;
      }, 500);
    }
  }

  title() {
    if (this.chain) {
      return this.chain.name;
    } else if (!this.chain && !this.chainLoaded) {
      return 'Cargando';
    } else if (!this.chain && this.chainLoaded) {
      return 'Crea tu propia cadena';
    }
  }

  isValidForm(form) {
    if (this.loading) {
      return false;
    } else {
      return form.valid;
    }
  }

}
