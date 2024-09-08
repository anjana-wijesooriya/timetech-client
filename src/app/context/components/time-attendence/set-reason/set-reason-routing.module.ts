import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetReasonComponent } from './set-reason.component';

const routes: Routes = [
  { path: '', component: SetReasonComponent, title: 'Set Reason' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetReasonRoutingModule { }
