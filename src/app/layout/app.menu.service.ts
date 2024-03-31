import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();
    private isMenuActive = new BehaviorSubject<boolean>(false);

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();
    isMenuActive$ = this.isMenuActive

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    onMenuStatusChange(isAvtive: boolean) {
        this.isMenuActive.next(isAvtive);
    }

    reset() {
        this.resetSource.next(true);
    }
}
