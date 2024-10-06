import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulingShiftWrComponent } from './scheduling-shift-wr.component';

const routes: Routes = [
  { path: '', component: SchedulingShiftWrComponent, title: 'Shift/Workrule for period' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduingShiftWrRoutingModule { }
