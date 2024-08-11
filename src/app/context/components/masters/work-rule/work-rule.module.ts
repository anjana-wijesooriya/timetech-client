import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WorkRuleRoutingModule } from './work-rule-routing.module';
import { WorkRuleComponent } from './work-rule.component';
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
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { InputSwitchCustom } from '../../utilities/custom-controls/input-switch.component';
import { CustomFormControlsModule } from '../../utilities/custom-controls/custom-form-controls.module';
import { InputColorCustom } from '../../utilities/custom-controls/color-picker.component';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TreeModule } from 'primeng/tree';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [WorkRuleComponent],
  imports: [
    CommonModule,
    WorkRuleRoutingModule,
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
    ToastModule,
    ScrollerModule,
    ListboxModule,
    TableModule,
    TabViewModule,
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
    DialogModule
  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ]
})
export class WorkRuleModule { }
