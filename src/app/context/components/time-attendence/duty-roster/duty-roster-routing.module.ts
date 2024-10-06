import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutyRosterComponent } from './duty-roster.component';

const routes: Routes = [{
  path: '', component: DutyRosterComponent, title: 'Duty Roaster'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyRosterRoutingModule { }
