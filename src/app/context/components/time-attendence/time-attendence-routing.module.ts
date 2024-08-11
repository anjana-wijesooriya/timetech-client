import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'shift', loadChildren: () => import('./shift/shift.module').then(m => m.ShiftModule) },
  { path: 'reason', loadChildren: () => import('./reason/reason.module').then(m => m.ReasonModule) },
  { path: 'daily-worksheet', loadChildren: () => import('./work-sheet/work-sheet.module').then(m => m.WorkSheetModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeAttendenceRoutingModule { }
