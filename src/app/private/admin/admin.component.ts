import { Component, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Observable, ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  settings: any;
  onSettingsChanged: Subscription;
  layoutMode = false;

  private _media$: ReplaySubject<MediaChange> = new ReplaySubject(1);
  private _mediaSubscription: Subscription;

  sidenavOpen = true;
  sidenavMode = 'side';
  sidenavAlign = 'start';
  customizerSidenavAlign = 'end';

  get media$(): Observable<MediaChange> {
    return this._media$.asObservable();
  }

  constructor(media: ObservableMedia) {
    media
      .asObservable()
      .subscribe(
        res => this._media$.next(res),
        err => this._media$.error(err),
        () => this._media$.complete()
      );
  }
  ngOnInit() {
    this._mediaSubscription = this.media$.subscribe((change: MediaChange) => {
      const isMobile = change.mqAlias === 'xs' || change.mqAlias === 'sm';

      this.sidenavMode = isMobile ? 'over' : 'side';
      this.sidenavOpen = !isMobile;
    });

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 2000);
  }

}
