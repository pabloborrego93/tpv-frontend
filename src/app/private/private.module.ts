import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { BrandComponent } from './brand/brand.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*
* Providers
*/
import { AuthInterceptor } from '../auth.interceptor';
import { MyProfileService } from './my-profile/my-profile.service';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    BrandComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,
    MyProfileComponent
  ],
  providers: [
    MyProfileService
  ]
})
export class PrivateModule { }
