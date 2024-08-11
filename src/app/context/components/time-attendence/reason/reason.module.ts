import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReasonRoutingModule } from './reason-routing.module';
import { ReasonComponent } from './reason.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ColorPickerModule } from 'primeng/colorpicker';
import { AlertService } from 'src/app/context/service/alert.service';
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { InputColorCustom } from '../../utilities/custom-controls/color-picker.component';
import { CustomFormControlsModule } from '../../utilities/custom-controls/custom-form-controls.module';


@NgModule({
  declarations: [ReasonComponent],
  imports: [
    CommonModule,
    ReasonRoutingModule,
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
        { name: 'switch', component: InputSwitchCustom },
        { name: 'color', component: InputColorCustom }
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
    ColorPickerModule,
    CustomFormControlsModule,
  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ]
})
export class ReasonModule { }
