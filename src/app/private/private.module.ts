import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { BrandComponent } from './brand/brand.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyProfileService } from './my-profile/my-profile.service';
import { NavigationModule } from './navigation/navigation.module';
import { PrivateRoutingModule } from './private-routing.module';
import { ChainService } from './restaurant-chain/chain.service';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RestaurantService } from './restaurant/restaurant.service';
import { ProductFamilyComponent } from './product-family/product-family.component';
import { ProductFamilyService } from './product-family/product-family.service';
import { ProductComponent } from './product/product.component';
import { ProductService } from './product/product.service';
import { FormHeaderComponent } from './form-header/form-header.component';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationModule
  ],
  declarations: [
    AdminComponent,
    BrandComponent,
    HeaderComponent,
    FooterComponent,
    MyProfileComponent,
    RestaurantChainComponent,
    RestaurantComponent,
    ProductFamilyComponent,
    ProductComponent,
    FormHeaderComponent
  ],
  providers: [
    MyProfileService,
    ChainService,
    RestaurantService,
    ProductFamilyService,
    ProductService
  ]
})
export class PrivateModule { }
