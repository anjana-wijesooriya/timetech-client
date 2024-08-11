import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { ReasonRoutingModule } from '../../time-attendence/reason/reason-routing.module';
import { InputFieldWrapper } from '../field-wrappers/input-wrapper.component';
import { InputColorCustom } from './color-picker.component';
import { InputSwitchCustom } from './input-switch.component';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';

const components = [
  InputSwitchCustom,
  InputColorCustom,
  InputFieldWrapper,

]

@NgModule({
  declarations: components, exports: components,
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
    InputTextModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    CheckboxModule,
    InputNumberModule,
    InputSwitchModule,
    DropdownModule,
    TooltipModule,
    ColorPickerModule,
    FileUploadModule,
  ]
})
export class CustomFormControlsModule { }
