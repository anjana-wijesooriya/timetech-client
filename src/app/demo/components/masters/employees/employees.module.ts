import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmployeesComponent } from './employees.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TableDemoRoutingModule } from '../../uikit/table/tabledemo-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@NgModule({
    declarations: [EmployeesComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: EmployeesComponent }
        ]),
        TableModule,
        TableDemoRoutingModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        SidebarModule,
        ImageModule,
        ToolbarModule,
        MessagesModule,
        IconFieldModule,
        InputIconModule,
    ],
    providers: [
        MessageService,
        ConfirmationService
    ]
})
export class EmployeesModule { }