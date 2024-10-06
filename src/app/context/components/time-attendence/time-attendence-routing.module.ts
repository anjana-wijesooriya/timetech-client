import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'shift', loadChildren: () => import('./shift/shift.module').then(m => m.ShiftModule) },
    { path: 'reason', loadChildren: () => import('./reason/reason.module').then(m => m.ReasonModule) },
    { path: 'daily-worksheet', loadChildren: () => import('./work-sheet/work-sheet.module').then(m => m.WorkSheetModule) },
    { path: 'set-reason', loadChildren: () => import('./set-reason/set-reason.module').then(m => m.SetReasonModule) },
    { path: 'duty-roster', loadChildren: () => import('./duty-roster/duty-roster.module').then(m => m.DutyRosterModule) },
    { path: 'duty-roster-import', loadChildren: () => import('./duty-roster-import/duty-roster-import.module').then(m => m.DutyRosterImportModule) },
    { path: 'schedule-shift-or-workrule', loadChildren: () => import('./scheduing-shift-wr/scheduing-shift-wr.module').then(m => m.ScheduingShiftWrModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimeAttendenceRoutingModule { }
