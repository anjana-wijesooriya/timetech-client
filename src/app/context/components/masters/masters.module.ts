import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MastersRoutingModule } from './masters-routing.module';
import { MessageService } from 'primeng/api';

import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
    imports: [CommonModule, MastersRoutingModule],
    providers: [
        MessageService,
        OverlayPanelModule
    ]
})
export class MastersModule { }