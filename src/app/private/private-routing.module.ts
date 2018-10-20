import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';

import { AdminComponent } from './admin/admin.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    children: [
      { path: 'myprofile', component: MyProfileComponent },
      { path: 'chain', component: RestaurantChainComponent },
      { path: 'restaurant/:name', component: RestaurantComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
