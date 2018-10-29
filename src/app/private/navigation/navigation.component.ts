import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  navigationModel: any[];
  navigationModelChangeSubscription: Subscription;

  constructor(private service: NavigationService) {
    this.navigationModelChangeSubscription = this.service.onNavigationModelChange.subscribe(
      navigation => {
        this.navigationModel = navigation;
      }
    );
  }

  ngOnInit() {
    // this.addSubitemToNavigation()
    this.service.updateNavigation();
  }

  ngOnDestroy() {
    this.navigationModelChangeSubscription.unsubscribe();
  }

  updateExtendBadge() {
    const extendNavItem = this.service.getNavigationItem('extend');
    extendNavItem.badge.title = 6;
  }

}
