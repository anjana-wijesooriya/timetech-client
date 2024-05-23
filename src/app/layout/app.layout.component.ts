import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from "./service/app.layout.service";
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppTopBarComponent } from './app.topbar.component';
import { LocalStorage } from '../context/shared/enum/local-storage.enum';
import { BaseService } from '../context/service/base.service';
import { Utils } from 'src/app/context/shared/utils';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html'
})
export class AppLayoutComponent implements OnDestroy, OnInit {

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    profileMenuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(private route: ActivatedRoute, public layoutService: LayoutService, public renderer: Renderer2, public router: Router,
        private baseService: BaseService) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                        || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.profileMenuOutsideClickListener) {
                this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                        || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideProfileMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((res) => {
                // console.log(res)
                this.hideMenu();
                this.hideProfileMenu();
                // let bread = this.createBreadcrumbs(this.route.root);
                // console.log(bread)
            });

        this.route.data.subscribe((data: Data) => {
            console.log(data);
        })
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: any, url: string }> = []): Array<{ label: string, url: string }> {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            breadcrumbs.push({ label: child.snapshot.data, url: url });
            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }

    ngOnInit(): void {
        this.setLoggedUserDetails()
    }

    setLoggedUserDetails() {
        let user = new Utils().getLocalStorage(LocalStorage.UserDetails);
        this.baseService.setLoginDetails(user);
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-slim': this.layoutService.config().menuMode === 'slim',
            'layout-compact': this.layoutService.config().menuMode === 'compact',
            'layout-horizontal': this.layoutService.config().menuMode === 'horizontal',
            'layout-reveal': this.layoutService.config().menuMode === 'reveal',
            'layout-drawer': this.layoutService.config().menuMode === 'drawer',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple,
            'layout-sidebar-white': this.layoutService.config().menuColor == 'white',
            'layout-sidebar-darkgray': this.layoutService.config().menuColor == 'darkgray',
            'layout-sidebar-blue': this.layoutService.config().menuColor == 'blue',
            'layout-sidebar-bluegray': this.layoutService.config().menuColor == 'bluegray',
            'layout-sidebar-brown': this.layoutService.config().menuColor == 'brown',
            'layout-sidebar-cyan': this.layoutService.config().menuColor == 'cyan',
            'layout-sidebar-green': this.layoutService.config().menuColor == 'green',
            'layout-sidebar-indigo': this.layoutService.config().menuColor == 'indigo',
            'layout-sidebar-deeppurple': this.layoutService.config().menuColor == 'deeppurple',
            'layout-sidebar-orange': this.layoutService.config().menuColor == 'orange',
            'layout-sidebar-pink': this.layoutService.config().menuColor == 'pink',
            'layout-sidebar-purple': this.layoutService.config().menuColor == 'purple',
            'layout-sidebar-teal': this.layoutService.config().menuColor == 'teal',
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
