import { Component, ElementRef, HostListener } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { MenuService } from './app.menu.service';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {

    items: MenuItem[] | undefined;
    constructor(public layoutService: LayoutService, public el: ElementRef,
        private menuService: MenuService, private messageService: MessageService
    ) {



    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: PointerEvent) {
        const nativeElement: any = document.getElementsByClassName('layout-sidebar')[0];
        const clickedInside: boolean = nativeElement.contains(event.target);
        if (!clickedInside) {
            this.menuService.isMenuActive$.next(false);
        }
    }

    onMenuEnter(event: Event) {
        document.querySelector('.layout-wrapper').classList.add('layout-sidebar-active');
    }

    onMenuLeave(event: Event) {
        document.querySelector('.layout-wrapper').classList.remove('layout-sidebar-active');
    }

}
