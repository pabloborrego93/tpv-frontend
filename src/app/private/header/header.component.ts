import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as screenfull from 'screenfull';
import { AuthService } from '../../auth.service';
import { ERR_LOGOUT } from '../../app.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // @Input() customizer;
  @Input() sidenav;

  isFullscreen = false;
  showLoading: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    public snackBar: MatSnackBar) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.showLoading = false;
      }
    });
  }

  ngOnInit() {
  }

  toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  navegarMiPerfil() {
    this.router.navigate(['/admin/miperfil']);
  }

  doLogOut(): void {
    if (this.authService.doLogOut()) {
      this.router.navigate(['/home']);
    } else {
      this.openSnackBar(ERR_LOGOUT, 'Cerrar');
    }
  }

}
