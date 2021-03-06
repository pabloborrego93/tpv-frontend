import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TimeAgoPipe } from '../pipes/TimeAgoPipe.pipe';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { BrandComponent } from './brand/brand.component';
import { FooterComponent } from './footer/footer.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { HeaderComponent } from './header/header.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { KitchenService } from './kitchen/kitchen.service';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyProfileService } from './my-profile/my-profile.service';
import { NavigationModule } from './navigation/navigation.module';
import { AddcommentComponent } from './order/addcomment/addcomment.component';
import { OrderComponent } from './order/order.component';
import { OrderService } from './order/order.service';
import { ProductCompositeViewComponent } from './order/product-composite-view/product-composite-view.component';
import { PrivateRoutingModule } from './private-routing.module';
import { ProductFamilyComponent } from './product-family/product-family.component';
import { ProductFamilyService } from './product-family/product-family.service';
import { ProductImageCropperComponent } from './product/product-image-cropper/product-image-cropper.component';
import { ProductComponent } from './product/product.component';
import { ProductService } from './product/product.service';
import { ChainService } from './restaurant-chain/chain.service';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { ConfirmDeleteZoneComponent } from './restaurant/confirm-delete-zone/confirm-delete-zone.component';
import { ConfirmDeletePrinterComponent } from './restaurant/confirm-delete-printer/confirm-delete-printer.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RestaurantService } from './restaurant/restaurant.service';
import { ConfirmDeleteComponent } from './user/confirm-delete/confirm-delete.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
// tslint:disable-next-line:max-line-length
import { ConfirmDeleteProductFamilyComponent } from './product-family/confirm-delete-product-family/confirm-delete-product-family.component';
import { ConfirmCloseOrderComponent } from './order/confirm-close-order/confirm-close-order.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    PerfectScrollbarModule,
    NgxChartsModule
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
    ConfirmDeletePrinterComponent,
    OrderComponent,
    TimeAgoPipe,
    AddcommentComponent,
    ProductCompositeViewComponent,
    KitchenComponent,
    ConfirmDeleteProductFamilyComponent,
    ConfirmCloseOrderComponent,
    StatisticsComponent
  ],
  providers: [
    MyProfileService,
    ChainService,
    RestaurantService,
    ProductFamilyService,
    ProductService,
    UserService,
    OrderService,
    KitchenService
  ],
  entryComponents: [
    ProductImageCropperComponent,
    ConfirmDeleteComponent,
    ConfirmDeleteZoneComponent,
    ConfirmDeletePrinterComponent,
    ConfirmDeleteProductFamilyComponent,
    AddcommentComponent,
    ConfirmCloseOrderComponent
  ]
})
export class PrivateModule { }
