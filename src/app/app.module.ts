import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './private/admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { SignupComponent } from './signup/signup.component';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RestorePasswordComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '', redirectTo: '/home', pathMatch: 'full'
      }, {
        path: 'home', component: HomeComponent
      }, {
        path: 'signup', component: SignupComponent
      }, {
        path: 'login', component: LoginComponent
      }, {
        path: 'restore-password', component: RestorePasswordComponent
      }, {
        path: 'admin',
        loadChildren: 'app/private/private.module#PrivateModule',
        canLoad: [AuthGuard]
      }, {
        path: '**', redirectTo: '/home', pathMatch: 'full'
      }
    ])
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
