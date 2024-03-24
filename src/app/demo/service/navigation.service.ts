import { Injectable } from '@angular/core';
import { ISidebarState } from '../models/module/sidebar-state.model';
import { IChildItem, IMenuItem } from '../models/module/menu-item.model';
import { BehaviorSubject } from 'rxjs';

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

  setMenuItems(menuItems: IMenuItem[]){
    this.menuItems$.next(menuItems);
  }

  getMenuItems(){
    return this.menuItems$.asObservable();
  }

}
