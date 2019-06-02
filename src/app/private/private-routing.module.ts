import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AdminComponent } from './admin/admin.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProductFamilyComponent } from './product-family/product-family.component';
import { ProductComponent } from './product/product.component';
import { RestaurantChainComponent } from './restaurant-chain/restaurant-chain.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      roles: []
    },
    children: [
      {
        path: 'myprofile',
        component: MyProfileComponent,
        data: {
          roles: []
        }
      }, {
        path: 'chain',
        component: RestaurantChainComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }, {
        path: 'restaurant/:name',
        component: RestaurantComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }, {
        path: 'product-families',
        component: ProductFamilyComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }, {
        path: 'products',
        component: ProductComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }, {
        path: 'users',
        component: UserComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }, {
        path: 'orders/:id',
        component: OrderComponent,
        data: {
          roles: ['ROLE_WAITER']
        }
      }, {
        path: 'kitchen/:id',
        component: KitchenComponent,
        data: {
          roles: ['ROLE_ORDER_SCREEN']
        }
      }, {
        path: 'statistics',
        component: StatisticsComponent,
        data: {
          roles: ['ROLE_RESTAURANT_CHAIN_ADMIN']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
