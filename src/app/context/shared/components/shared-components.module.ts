import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';

const components = [
    BreadcrumbsComponent,
];

@NgModule({
    declarations: components,
    imports: [
        CommonModule,
        RouterModule,
        CalendarModule,
    ],
    exports: components
})
export class SharedComponentsModule { }