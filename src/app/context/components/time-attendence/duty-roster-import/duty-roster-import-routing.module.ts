import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutyRosterImportComponent } from './duty-roster-import.component';

const routes: Routes = [
  { path: '', component: DutyRosterImportComponent, title: 'Import Duty Roaster' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyRosterImportRoutingModule { }
