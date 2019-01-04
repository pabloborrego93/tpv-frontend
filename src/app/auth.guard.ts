import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.getUserInfo().pipe(
      map((getUserInfo: any) => {
        const expectedRolesArray = route.data.roles;
        const token = localStorage.getItem('currentUser');
        const roles = getUserInfo.roles;
        let hasPermission = false;

        console.log('Hace falta para entrar: ');
        console.log(expectedRolesArray);
        console.log('Y tengo: ');
        console.log(roles);

        expectedRolesArray.forEach((eR) => {
          roles.forEach((r) => {
            if (eR === r.name) {
              hasPermission = true;
            }
          });
        });

        if ((token && hasPermission) || (token && expectedRolesArray.length === 0)) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }

      }),
      catchError((err) => {
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return this.authService.getUserInfo().pipe(
      map((getUserInfo: any) => {
        const expectedRolesArray = route.data.roles;
        const token = localStorage.getItem('currentUser');
        const roles = getUserInfo.roles;
        let hasPermission = false;

        console.log('Hace falta para entrar: ');
        console.log(expectedRolesArray);
        console.log('Y tengo: ');
        console.log(roles);

        expectedRolesArray.forEach((eR) => {
          roles.forEach((r) => {
            if (eR === r.name) {
              hasPermission = true;
            }
          });
        });

        if ((token && hasPermission) || (token && expectedRolesArray.length === 0)) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }

      }),
      catchError((err) => {
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.getUserInfo().pipe(
      map((getUserInfo: any) => {
        const expectedRolesArray = route.data.roles;
        const token = localStorage.getItem('currentUser');
        const roles = getUserInfo.roles;
        let hasPermission = false;

        console.log('Hace falta para entrar: ');
        console.log(expectedRolesArray);
        console.log('Y tengo: ');
        console.log(roles);

        expectedRolesArray.forEach((eR) => {
          roles.forEach((r) => {
            if (eR === r.name) {
              hasPermission = true;
            }
          });
        });

        if ((token && hasPermission) || (token && expectedRolesArray.length === 0)) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }

      }),
      catchError((err) => {
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }
}
