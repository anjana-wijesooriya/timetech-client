import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISidebarState } from '../api/module/sidebar-state.model';
import { IChildItem, IMenuItem } from '../api/module/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false
  };
  selectedItem: IMenuItem;
  selectedChildMenu: IChildItem;
  menuItems$ = new BehaviorSubject<IMenuItem[]>([]);

  constructor() { }

  setMenuItems(menuItems: IMenuItem[]) {
    this.menuItems$.next(menuItems);
  }

  getMenuItems() {
    return this.menuItems$.asObservable();
  }

}
