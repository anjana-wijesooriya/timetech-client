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

        this.items = [
            {
                tooltipOptions: {
                    tooltipLabel: 'Add'
                },
                icon: 'pi pi-pencil',
                command: () => {
                    this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Update'
                },
                icon: 'pi pi-refresh',
                command: () => {
                    this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Delete'
                },
                icon: 'pi pi-trash',
                command: () => {
                    this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Upload'
                },
                icon: 'pi pi-upload'
            },
            {
                tooltipOptions: {
                    tooltipLabel: 'Angular Website'
                },
                icon: 'pi pi-external-link',
                url: 'http://angular.io'
            }
        ];

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
