import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ShiftRoutingModule } from './shift-routing.module';
import { ShiftComponent } from './shift.component';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
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
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@NgModule({
  declarations: [ShiftComponent],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    // Dynamic
    FormlyPrimeNGModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' }
      ],
      types: [
        { name: 'switch', component: InputSwitchCustom }
      ],
      wrappers: [
        { name: 'panel', component: InputFieldWrapper },
      ],
    }),
    FormlyDatepickerModule,
    FormlyCheckboxModule,
    ToastModule,
    ScrollerModule,
    ListboxModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    FieldsetModule,
    TooltipModule,
    CheckboxModule,
    ChipModule,
    TabViewModule,
    SidebarModule,
    InputNumberModule,
    InputSwitchModule,
    CardModule,
    DropdownModule,
    ConfirmDialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    TooltipModule,
  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ]
})
export class ShiftModule { }
