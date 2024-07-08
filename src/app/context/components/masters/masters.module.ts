import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MastersRoutingModule } from './masters-routing.module';
import { MessageService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  imports: [CommonModule, MastersRoutingModule],
  providers: [
    MessageService,
    OverlayPanelModule,
    InputTextModule,
    ListboxModule
  ],
  declarations: [
  ]
})
export class MastersModule { }