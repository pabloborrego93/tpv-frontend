import { Component, Input, OnInit, Inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as screenfull from 'screenfull';
import { AuthService } from '../../auth.service';
import { OK_LOGOUT } from '../../app.constants';

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
    private authService: AuthService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.showLoading = false;
      }
      if (this.sidenav && this.sidenav.opened && screenfull.isFullscreen) {
        this.toggleMenu();
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

  toggleMenu() {
    this.sidenav.opened = !this.sidenav.opened;
  }

  navegarMiPerfil() {
    this.router.navigate(['/admin/myprofile']);
  }

  doLogOut(): void {
    this.authService.doLogOut(OK_LOGOUT);
  }

}
