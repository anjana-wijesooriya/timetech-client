import { ChangeDetectorRef, Component, Host, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './app.menu.service';
import { LayoutService } from './service/app.layout.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    templateUrl: './app.menuitem.component.html',
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index!: number;

    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

    @Input() parentKey!: string;

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = "";

    constructor(public layoutService: LayoutService, private cd: ChangeDetectorRef, public router: Router, private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(value => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                }
                else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            });
        
        this.menuService.isMenuActive$.subscribe((value) => {
            if (!value) {
                document.querySelectorAll('.layout-menu .menu-item-active').forEach((item) => {
                item.classList.remove('menu-item-active');
            });
            }
        })
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
        }
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;

            if (this.layoutService.config().menuMode == 'slim' || this.layoutService.config().menuMode == 'compact' ||
              this.layoutService.config().menuMode == 'reveal') {
                
                if (!this.menuService.isMenuActive$.getValue()) {
                    this.menuService.onMenuStatusChange(true);
                    const elm = event.currentTarget as HTMLElement;
                    const elementPosition = elm.getBoundingClientRect();
                    const menuElm = elm.nextElementSibling as HTMLElement;
                    menuElm.style.top = elementPosition.top + 'px';
                    // menuElm.style.display = 'block';
                    menuElm.classList.add('menu-item-active');
                }
            }

            if (this.root && this.layoutService.config().menuMode == 'horizontal') {

                if (!this.menuService.isMenuActive$.getValue()) {
                    this.menuService.onMenuStatusChange(true);
                    const elm = event.currentTarget as HTMLElement;
                    const elementPosition = elm.getBoundingClientRect();
                    const menuElm = elm.nextElementSibling as HTMLElement;
                    menuElm.style.left = elementPosition.left + 'px';
                    // menuElm.style.display = 'block';
                    menuElm.classList.add('menu-item-active');
                }
            }
        }

        this.menuService.onMenuStateChange({ key: this.key });
    }

    onMouseEnter(event: Event) {
        if (this.root && (this.layoutService.config().menuMode == 'slim' || this.layoutService.config().menuMode == 'compact' ||
            this.layoutService.config().menuMode == 'compact') && this.menuService.isMenuActive$.getValue()) {
            // this.menuService.onMenuStatusChange(true);
            const elm = event.currentTarget as HTMLElement;

            elm.closest('.layout-menu').querySelectorAll('.menu-item-active').forEach((item) => {
                item.classList.remove('menu-item-active');
            });

            const elementPosition = elm.getBoundingClientRect();
            const menuElm = elm.nextElementSibling as HTMLElement;
            menuElm.style.top = elementPosition.top + 'px';
            // menuElm.style.display = 'block';
            menuElm.classList.add('menu-item-active');
        }

        if (this.root && this.layoutService.config().menuMode == 'horizontal' && this.menuService.isMenuActive$.getValue()) {
        
            const elm = event.currentTarget as HTMLElement;

            elm.closest('.layout-menu').querySelectorAll('.menu-item-active').forEach((item) => {
                item.classList.remove('menu-item-active');
            });
            
            const elementPosition = elm.getBoundingClientRect();
            const menuElm = elm.nextElementSibling as HTMLElement;
             menuElm.style.left = elementPosition.left + 'px';
            // menuElm.style.display = 'block';
            menuElm.classList.add('menu-item-active');
        }
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
