import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from './auth.service';
import { endpointsSinJWT, ERR_TOKEN_EXPIRED } from './app.constants';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req instanceof HttpRequest && !this.isEndpointWithOutJWTAuth(req)) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${this.auth.getAuthorizationToken()}`} });
    }

    return next.handle(req)
      .catch((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.doLogOut(ERR_TOKEN_EXPIRED);
        }
        return throwError(req);
      });
  }

  isEndpointWithOutJWTAuth(req: HttpRequest<any>) {
    return endpointsSinJWT.find((eP) => eP === req.url);
  }

}
