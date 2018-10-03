import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from './auth.service';
import { endpointsSinJWT } from './app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req instanceof HttpRequest && !endpointsSinJWT.find((eP) => eP === req.url)) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${this.auth.getAuthorizationToken()}`} });
    }
    return next.handle(req);
  }
}
