import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeAttendenceRoutingModule } from './time-attendence-routing.module';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SetReasonComponent } from './set-reason/set-reason.component';


@NgModule({
  declarations: [
    SetReasonComponent
  ],
  imports: [
    CommonModule,
    TimeAttendenceRoutingModule
  ],
  providers: [
    MessageService,
    OverlayPanelModule,
    InputTextModule,
    ListboxModule
  ]
})
export class TimeAttendenceModule { }
