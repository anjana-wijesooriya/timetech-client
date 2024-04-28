import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MastersRoutingModule } from './masters-routing.module';
import { MessageService } from 'primeng/api';

@NgModule({
    imports: [CommonModule, MastersRoutingModule],
    providers: [
        MessageService
    ]
})
export class MastersModule { }