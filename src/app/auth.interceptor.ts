import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from './auth.service';
import { endpointsSinJWT, ERR_TOKEN_EXPIRED } from './app.constants';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req instanceof HttpRequest && !this.isEndpointWithOutJWTAuth(req)) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${this.auth.getAuthorizationToken()}` } });
    }

    return next.handle(req)
      .do(event => {
        if (event instanceof HttpResponse && !this.isEndpointWithOutJWTAuth(req)) {
        //   console.log(event);
        //   const currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
        //   console.log(currentUser);
        //   if (currentUser) {
        //     const username = currentUser.username;
        //     console.log(username);
        //     const token = JSON.stringify({ username, token: req.headers.get('authorization') });
        //     console.log(token);
        //     if (token) {
        //       localStorage.setItem('currentUser', token.substring(7, token.length));
        //     }
        //   }
        }
      })
      .catch((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.doLogOut(ERR_TOKEN_EXPIRED);
        }
        return throwError(error);
      });
  }

  isEndpointWithOutJWTAuth(req: HttpRequest<any>) {
    return endpointsSinJWT.find((eP) => (eP.path === req.url) && (eP.method === req.method));
  }

}
