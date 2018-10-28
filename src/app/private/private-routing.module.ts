import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AdminComponent } from './admin/admin.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProductFamilyComponent } from './product-family/product-family.component';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    children: [
      { path: 'myprofile', component: MyProfileComponent },
      { path: 'chain', component: RestaurantChainComponent },
      { path: 'restaurant/:name', component: RestaurantComponent },
      { path: 'product-families', component: ProductFamilyComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
