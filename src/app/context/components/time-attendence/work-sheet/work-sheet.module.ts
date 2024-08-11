import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WorkSheetRoutingModule } from './work-sheet-routing.module';

import { WorkSheetComponent } from './work-sheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { AlertService } from 'src/app/context/service/alert.service';
import { InputColorCustom } from '../../utilities/custom-controls/color-picker.component';
import { CustomFormControlsModule } from '../../utilities/custom-controls/custom-form-controls.module';
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [WorkSheetComponent],
  imports: [
    CommonModule,
    WorkSheetRoutingModule,
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
    CustomFormControlsModule,
    PanelModule,
    ToastModule,
    InputGroupModule,
    ScrollerModule,
    ListboxModule,
    MultiSelectModule,
    TableModule,
    TabViewModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    TabMenuModule,
    SidebarModule,
    InputNumberModule,
    InputSwitchModule,
    DropdownModule,
    ConfirmDialogModule,
    ChipModule,
    DividerModule,
    TreeModule,
    OverlayPanelModule,
    CheckboxModule,
    TreeSelectModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ]
})
export class WorkSheetModule { }
