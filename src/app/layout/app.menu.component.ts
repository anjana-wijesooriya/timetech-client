import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ModuleService } from '../context/service/module.service';
import { ModuleModel } from '../context/api/module/module.model';
import { NavigationService } from '../context/service/navigation.service';
import { Router } from '@angular/router';
import { IChildItem, IMenuItem } from '../context/api/module/menu-item.model';
import { MenuIconsEnum } from '../context/shared/enum/menu-icons';
import { BaseService } from '../context/service/base.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    activeModules: ModuleModel[] = [];
    selectedItem: any[] = [];
    menuItems: IMenuItem[] = [];
    isLoading: boolean = false;

    constructor(public layoutService: LayoutService, private moduleService: ModuleService,
        public navigationService: NavigationService, private router: Router,
        private baseService: BaseService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Prime Blocks',
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                ]
            },
            {
                label: 'Utilities',
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                    { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    },
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                    }
                ]
            }
        ];
        this.getMenuItemsByBaseMenu()
        this.getMenuItems();
    }

    getMenuItemsByBaseMenu() {
        this.isLoading = true;
        const userDetails = this.baseService.userDetails$.getValue();
        this.moduleService.getModules(userDetails.id, 2, 'en').subscribe(response => {
            // this.subModules = response;
            // this.groupBy(response, 'groupName')
            this.isLoading = false;
            this.moduleService.setActiveModules(response);
            localStorage.setItem('Personal', JSON.stringify(response));
        })
    }

    getMenuItems() {
        this.moduleService.getActiveModules().subscribe(result => {
            this.activeModules = result;
            this.prepareMenuItems(result);
        })
    }

    groupBy(items: any[], key: string) {
        return items.reduce((result, item) => (
            { ...result, [item[key]]: [...(result[item[key]] || []), item,], }), {},);
    }

    prepareMenuItems(result: ModuleModel[]) {
        var grouped = this.groupBy(result, 'groupName');
        let keys: string[] = Object.keys(grouped);
        let values: any[] = Object.values(grouped);
        this.model = [];
        keys.forEach((element, index) => {
            let sub: any[] = [];
            values[index].forEach((item) => {
                sub.push({
                    label: item.btnDisplay,
                    type: 'link',
                    tooltip: item.btnToolTip,
                    icon: 'ic ' + item.btnPicture,
                    routerLink: item.btnTag
                })
            });

            let icon = MenuIconsEnum.find(a => a.name == element);
            this.model.push({
                label: element,
                icon: 'ic ' + icon.icon,
                items: sub
            });
        });

        this.navigationService.setMenuItems(this.menuItems);
    }

    onClickChangeActiveFlag(item: any) {
        this.setActiveMainItem(item);
    }

    setActiveMainItem(item: any) {
        this.menuItems.forEach(i => {
            i.active = false;
        });
        item.active = true;
    }

    selectItem(item: IMenuItem) {
        this.navigationService.sidebarState.childnavOpen = true;
        this.navigationService.selectedItem = item;
        this.setActiveMainItem(item);
    }

    closeChildNav() {
        this.navigationService.sidebarState.childnavOpen = false;
        // this.setActiveFlag();
    }

    onNavigate(childMenu: IChildItem) {
        this.navigationService.selectedChildMenu = childMenu;
        this.router.navigate([childMenu.state]);
    }
}
