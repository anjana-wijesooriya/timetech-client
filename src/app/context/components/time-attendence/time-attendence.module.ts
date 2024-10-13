import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeAttendenceRoutingModule } from './time-attendence-routing.module';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SetReasonComponent } from './set-reason/set-reason.component';
import { DutyRosterComponent } from './duty-roster/duty-roster.component';
import { QuickRefComponent } from './quick-ref/quick-ref.component';


@NgModule({
  declarations: [
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
