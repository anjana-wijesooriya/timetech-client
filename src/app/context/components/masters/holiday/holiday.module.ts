import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HolidayRoutingModule } from './holiday-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { HolidayComponent } from './holiday.component';
import { Dropdown, DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [HolidayComponent],
  imports: [
    CommonModule,
    HolidayRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ScrollerModule,
    ListboxModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    SidebarModule,
    InputNumberModule,
    InputSwitchModule,
    DropdownModule
  ],
  providers: [
    DatePipe
  ]
})
export class HolidayModule { }
