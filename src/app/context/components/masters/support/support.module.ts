import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';
import { ToastModule } from 'primeng/toast';
import { ScrollerModule } from 'primeng/scroller';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: SupportComponent, title: 'Support' },
    ]),
    ToastModule,
    ScrollerModule,
    ListboxModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    SidebarModule,
    InputNumberModule,
    InputSwitchModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    FilterService,
    AlertService,
  ],
})
export class SupportModule { }
