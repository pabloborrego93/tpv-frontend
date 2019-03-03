import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { BrandComponent } from './brand/brand.component';
import { FooterComponent } from './footer/footer.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { HeaderComponent } from './header/header.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyProfileService } from './my-profile/my-profile.service';
import { NavigationModule } from './navigation/navigation.module';
import { OrderComponent } from './order/order.component';
import { PrivateRoutingModule } from './private-routing.module';
import { ProductFamilyComponent } from './product-family/product-family.component';
import { ProductFamilyService } from './product-family/product-family.service';
import { ProductImageCropperComponent } from './product/product-image-cropper/product-image-cropper.component';
import { ProductComponent } from './product/product.component';
import { ProductService } from './product/product.service';
import { ChainService } from './restaurant-chain/chain.service';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { ConfirmDeleteZoneComponent } from './restaurant/confirm-delete-zone/confirm-delete-zone.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RestaurantService } from './restaurant/restaurant.service';
import { ConfirmDeleteComponent } from './user/confirm-delete/confirm-delete.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { OrderService } from './order/order.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TimeAgoPipe } from '../pipes/TimeAgoPipe.pipe';
import { AddcommentComponent } from './order/addcomment/addcomment.component';
import { ProductCompositeViewComponent } from './order/product-composite-view/product-composite-view.component';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationModule,
    ImageCropperModule,
    InfiniteScrollModule,
    PerfectScrollbarModule
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
    FormHeaderComponent,
    ProductImageCropperComponent,
    UserComponent,
    ConfirmDeleteComponent,
    ConfirmDeleteZoneComponent,
    OrderComponent,
    TimeAgoPipe,
    AddcommentComponent,
    ProductCompositeViewComponent
  ],
  providers: [
    MyProfileService,
    ChainService,
    RestaurantService,
    ProductFamilyService,
    ProductService,
    UserService,
    OrderService
  ],
  entryComponents: [
    ProductImageCropperComponent,
    ConfirmDeleteComponent,
    ConfirmDeleteZoneComponent,
    AddcommentComponent
  ]
})
export class PrivateModule { }
