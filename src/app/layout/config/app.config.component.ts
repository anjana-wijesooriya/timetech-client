import { Component, Input } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent {
    @Input() minimal: boolean = false;

    scales: number[] = [11, 12, 13, 14, 15];
    menuColors: string[] = ['white', 'darkgray', 'blue', 'bluegray', 'brown', 'cyan', 'green',
        'indigo', 'deeppurple', 'orange', 'pink', 'purple', 'teal']

    themes: any[] = [
        { name: 'Bootstrap-Blue', value: 'bootstrap4-light-blue', color: '#007bff' },
        { name: 'Bootstrap-Purple', value: 'bootstrap4-light-purple', color: '#7a38a7' },
        { name: 'Material-Indigo', value: 'mdc-light-indigo', color: '#3F51B5' },
        { name: 'Material-Purple', value: 'mdc-light-deeppurple', color: '#673AB7' },
        { name: 'Tailwind', value: 'tailwind-light', color: '#4f46e5' },
        { name: 'Fluent', value: 'fluent-light', color: '#4f46e5' },
        { name: 'Lara-Indigo', value: 'lara-light-indigo', color: '#6366F1' },
        { name: 'Lara-Blue', value: 'lara-light-blue', color: '#6366F1' },
        { name: 'Lara-Purple', value: 'lara-light-purple', color: '#8B5CF6' },
        { name: 'Lara-Teal', value: 'lara-light-teal', color: '#14b8a6' },
        { name: 'Saga-Blue', value: 'saga-light-blue', color: '#2196F3' },
        { name: 'Saga-Green', value: 'saga-light-green', color: '#4CAF50' },
        { name: 'Saga-Orange', value: 'saga-light-orange', color: '#fb7500' },
        { name: 'Saga-Purple', value: 'saga-light-purple', color: '#9C27B0' },
    ]

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) { }

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
            theme: this.setTheme(this.theme, val)
        }));
        ;
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

    changeTheme(theme: string, colorScheme: string) {
        // this.theme = theme;
        // this.colorScheme = this.colorScheme;
        this.theme = this.setTheme(theme, this.colorScheme);
    }

    setTheme(_theme: string, _colorScheme: string) {
        if (_theme == 'tailwind-light' || _theme == 'fluent-light') {
            this.layoutService.config.update((config) => ({
                ...config,
                colorScheme: 'light',
            }));
            return _theme;
        }
        if (_theme.includes('light') && _colorScheme != 'light') {
            return _theme.replace('light', 'dark');
        }
        if (_theme.includes('dark') && _colorScheme != 'dark') {
            return _theme.replace('dark', 'light');
        }
        return _theme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
