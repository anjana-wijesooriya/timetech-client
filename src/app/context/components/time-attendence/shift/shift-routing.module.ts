import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftComponent } from './shift.component';

const routes: Routes = [
  { path: '', component: ShiftComponent, title: 'Shift' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRoutingModule { }
