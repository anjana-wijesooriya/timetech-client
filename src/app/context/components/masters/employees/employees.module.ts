import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SliderModule } from 'primeng/slider';
import { SplitterModule } from 'primeng/splitter';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AlertService } from 'src/app/context/service/alert.service';
import { ContactComponent } from './edit-employee/overview/contact/contact.component';
import { DependentsComponent } from './edit-employee/overview/dependents/dependents.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { GeneralComponent } from './edit-employee/overview/general/general.component';
import { PersonalComponent } from './edit-employee/overview/personal/personal.component';
import { SecurityComponent } from './edit-employee/overview/security/security.component';
import { EmployeesComponent } from './employees.component';
import { MenuModule } from 'primeng/menu';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { TerminalModule, TerminalService } from 'primeng/terminal';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { OverviewComponent } from './edit-employee/overview/overview.component';
import { DepartmentRightsComponent } from './edit-employee/department-rights/department-rights.component';
import { DocumentsComponent } from './edit-employee/documents/documents.component';
import { ChipModule } from 'primeng/chip';
import { EditDocumentsComponent } from './edit-employee/documents/edit-documents/edit-documents.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SkeletonModule } from 'primeng/skeleton';
import { TimeAttendanceDetailsComponent } from './edit-employee/time-attendance-details/time-attendance-details.component';
import { LeavesComponent } from './edit-employee/leaves/leaves.component';
import { SalaryBankComponent } from './edit-employee/salary-bank/salary-bank.component';
import { AttachmentsComponent } from './edit-employee/attachments/attachments.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BadgeModule } from 'primeng/badge';
import { AirTicketsComponent } from './edit-employee/air-tickets/air-tickets.component';

@NgModule({
    declarations: [
        EmployeesComponent,
        EditEmployeeComponent,
        PersonalComponent,
        ContactComponent,
        DependentsComponent,
        SecurityComponent,
        GeneralComponent,
        OverviewComponent,
        DepartmentRightsComponent,
        DocumentsComponent,
        EditDocumentsComponent,
        AddEmployeeComponent,
        TimeAttendanceDetailsComponent,
        LeavesComponent,
        SalaryBankComponent,
        AttachmentsComponent,
        AirTicketsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: EmployeesComponent, title: 'Employees' },
            {
                path: ':id', component: EditEmployeeComponent, title: 'Employee Details',
                children: [
                    { path: 'employee-overview', component: OverviewComponent, title: 'Employee Overview' },
                    { path: 'department-rights', component: DepartmentRightsComponent, title: 'Department Rights' },
                    { path: 'documents', component: DocumentsComponent, title: 'Documents' },
                    { path: 'leaves', component: LeavesComponent, title: 'Leaves' },
                    { path: 'time-attendance', component: TimeAttendanceDetailsComponent, title: 'Time Attendance' },
                    { path: 'salary-bank', component: SalaryBankComponent, title: 'Salary/Bank' },
                    { path: 'attachments', component: AttachmentsComponent, title: 'Attachments' },
                    { path: 'air-ticket', component: AirTicketsComponent, title: 'Air Tickets' },

                    { path: '', redirectTo: 'employee-overview', pathMatch: 'full' }
                ]
            },
            { path: '**', redirectTo: '', pathMatch: 'prefix' },
        ]),
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        TreeTableModule,
        FloatLabelModule,
        InputTextModule,
        ToggleButtonModule,
        TerminalModule,
        SkeletonModule,
        RippleModule,
        TooltipModule,
        MultiSelectModule,
        ChipModule,
        InputGroupModule,
        InputGroupAddonModule,
        DropdownModule,
        InputNumberModule,
        ProgressBarModule,
        ToastModule,
        BadgeModule,
        MenuModule,
        SidebarModule,
        GalleriaModule,
        PasswordModule,
        ImageModule,
        ToolbarModule,
        MessagesModule,
        IconFieldModule,
        FieldsetModule,
        InputIconModule,
        TreeModule,
        OverlayPanelModule,
        CheckboxModule,
        TreeSelectModule,
        TabViewModule,
        DialogModule,
        AvatarModule,
        AvatarGroupModule,
        TabMenuModule,
        InputSwitchModule,
        PanelModule,
        SelectButtonModule,
        CalendarModule,
        KeyFilterModule,
        InputTextareaModule,
        DividerModule,
        SplitterModule,
        FileUploadModule,
        ConfirmDialogModule,
        TagModule,
        DockModule,
        StepperModule,
        StepsModule,
    ],
    providers: [
        MessageService,
        ConfirmationService,
        FilterService,
        AlertService,
        TerminalService,
        DatePipe
    ]
})
export class EmployeesModule { }