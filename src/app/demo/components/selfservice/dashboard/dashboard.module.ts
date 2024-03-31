import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
        { path: '', component: DashboardComponent }
    ]),
    DropdownModule
  ],
})
export class DashboardModule {}
