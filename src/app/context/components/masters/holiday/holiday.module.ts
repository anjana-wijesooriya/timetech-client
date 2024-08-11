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
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { CalendarModule } from 'primeng/calendar';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
  declarations: [HolidayComponent],
  imports: [
    CommonModule,
    HolidayRoutingModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    FormlyPrimeNGModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    }),
    FormlyDatepickerModule,
    FormlyCheckboxModule,
    ToastModule,
    ScrollerModule,
    ListboxModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    SidebarModule,
    InputNumberModule,
    InputSwitchModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ]
})
export class HolidayModule { }
