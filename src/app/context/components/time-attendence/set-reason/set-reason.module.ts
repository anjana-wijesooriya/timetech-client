import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SetReasonRoutingModule } from './set-reason-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ScrollerModule } from 'primeng/scroller';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AlertService } from 'src/app/context/service/alert.service';
import { InputColorCustom } from '../../utilities/custom-controls/color-picker.component';
import { CustomFormControlsModule } from '../../utilities/custom-controls/custom-form-controls.module';
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { WorkSheetRoutingModule } from '../work-sheet/work-sheet-routing.module';
import { SetReasonComponent } from './set-reason.component';
import { TreeSelectCustom } from '../../utilities/custom-controls/tree-select.component';


@NgModule({
  declarations: [SetReasonComponent],
  imports: [
    CommonModule,
    SetReasonRoutingModule,
    FormsModule,

    ReactiveFormsModule,
    // Dynamic
    FormlyPrimeNGModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' }
      ],
      types: [
        { name: 'switch', component: InputSwitchCustom },
        { name: 'color', component: InputColorCustom },
        { name: 'treeselect', component: TreeSelectCustom },

      ],
      wrappers: [
        { name: 'panel', component: InputFieldWrapper },
      ],
    }),
    FormlyDatepickerModule,
    FormlyCheckboxModule,
    CustomFormControlsModule,
    ScrollerModule,
    FloatLabelModule,
    ToastModule,
    InputGroupModule,
    ListboxModule,
    FileUploadModule,
    MultiSelectModule,
    TableModule,
    TabViewModule,
    IconFieldModule,
    InputIconModule,
    SelectButtonModule,
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
    PanelModule,
    CalendarModule,
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
export class SetReasonModule { }
