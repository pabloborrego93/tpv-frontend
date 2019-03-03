import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from './auth.service';
import { endpointsSinJWT, endpointsWithRefreshToken, ERR_TOKEN_EXPIRED } from './app.constants';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && this.isEndpointWithRefreshToken(req)) {
                    const currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
                    if (currentUser) {
                        const token = event.headers.get('x-auth-token');
                        if (token) {
                            const username = currentUser.username;
                            const userInfo = JSON.stringify({ 'username': username, 'token': token });
                            localStorage.setItem('currentUser', userInfo);
                        }
                    }
                }
                return event;
            }));
    }

    isEndpointWithRefreshToken(req: HttpRequest<any>) {
        return endpointsWithRefreshToken.find((eP) => (eP.path === req.url) && (eP.method === req.method));
    }
}
