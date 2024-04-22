import { Component, Input } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent {
    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) {}

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    get menuMode(): string {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config().inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }
    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    set menuColor(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuColor: val,
        }));
    }

    get menuColor(): string {
        return this.layoutService.config().menuColor;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeMenuColor(color: string) {
        this.menuColor = color
    }

    /*  set changeColorScheme(colorScheme: string) {
        
        this.theme = this.theme;
        switch (colorScheme) {
            case 'bootstrap4-light-blue':
            case 'bootstrap4-light-purple':
            case 'md-light-indigo':
            case 'md-light-deeppurple':
            case 'mdc-light-indigo':
            case 'mdc-light-deeppurple':
            case 'lara-light-indigo':
            case 'mdc-light-deeppurple':
            case 'mdc-light-deeppurple':
            case 'mdc-light-deeppurple':
            case 'mdc-light-deeppurple':
            case 'mdc-light-deeppurple':
            this.theme = 'saga-blue';
            break;
            case 'light':
            this.theme = 'saga-blue';
            break;
        this.colorScheme = colorScheme;
        
    }

    get changeColorScheme() {
        return this.colorScheme;    }
*/
    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = this.colorScheme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
