import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationModel } from './navigation.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class NavigationService {
  onNavigationCollapseToggle = new EventEmitter<any>();
  onNavigationCollapseToggled = new EventEmitter<any>();
  onNavigationModelChange: BehaviorSubject<any> = new BehaviorSubject({});
  navigationModel: NavigationModel;
  constructor(private http: HttpClient) {
     this.getNavigation()
    .then((res) => {
        this.navigationModel = new NavigationModel(res);
        this.onNavigationModelChange.next(this.navigationModel.model);
    });
  }

  getNavigation() {
    return this.http
      .get('/api/navigation')
      .toPromise()
      .then((res) => res)
      .catch((err) => console.log('Error obteniendo navegacion'));
  }

  getNavigationModel() {
    return this.navigationModel.model;
  }

  setNavigationModel(model) {
    this.navigationModel = model;
    this.onNavigationModelChange.next(this.navigationModel.model);
  }

  addNavigationItem(location, item) {
    const locationArr = location.split('.');

    if (locationArr.length === 0) {
      return;
    }

    const navItem = this.findNavigationItemById(locationArr);

    switch (navItem.type) {
      case 'item':
        navItem.children = [];
        navItem.children.push(item);
        navItem.type = 'collapse';
        break;
      case 'collapse':
        navItem.children.push(item);
        break;
      case 'group':
        navItem.children.push(item);
        break;
      default:
        break;
    }
  }

  getNavigationItem(location) {
    const locationArr = location.split('.');

    if (locationArr.length === 0) {
      return;
    }

    return this.findNavigationItemById(locationArr);
  }

  findNavigationItemById(location, navigation?) {
    if (!navigation) {
      navigation = this.navigationModel.model;
    }

    for (const navItem of navigation) {
      if (navItem.id === location[0]) {
        if (location.length > 1) {
          location.splice(0, 1);
          return this.findNavigationItemById(location, navItem.children);
        } else {
          return navItem;
        }
      }
    }
  }
}
