import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { BrandComponent } from './brand/brand.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule
  ],
  declarations: [AdminComponent, BrandComponent, NavigationComponent, HeaderComponent, FooterComponent]
})
export class PrivateModule { }
