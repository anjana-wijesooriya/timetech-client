import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ScheduingShiftWrRoutingModule } from './scheduing-shift-wr-routing.module';
import { SchedulingShiftWrComponent } from './scheduling-shift-wr.component';
import {FlexRenderDirective} from '@tanstack/angular-table'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputColorCustom } from '../../utilities/custom-controls/color-picker.component';
import { CustomFormControlsModule } from '../../utilities/custom-controls/custom-form-controls.module';
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
  declarations: [
    SchedulingShiftWrComponent
  ],
  imports: [
    CommonModule,
    ScheduingShiftWrRoutingModule,
    FlexRenderDirective,
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
    FloatLabelModule,
    ToolbarModule,
    TreeSelectModule,
    TableModule,
    InputTextModule,
    OverlayPanelModule,
    MultiSelectModule,
    DatePickerModule,
    PanelModule,
    ButtonModule,
    SelectButtonModule,
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
    ConfirmationService
  ]
})
export class ScheduingShiftWrModule { }
