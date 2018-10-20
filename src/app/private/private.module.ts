import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { BrandComponent } from './brand/brand.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationModule } from './navigation/navigation.module';

/*
* Providers
*/
import { AuthInterceptor } from '../auth.interceptor';
import { MyProfileService } from './my-profile/my-profile.service';
import { ChainService } from './restaurant-chain/chain.service';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

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
    RestaurantComponent
  ],
  providers: [
    MyProfileService,
    ChainService
  ]
})
export class PrivateModule { }
