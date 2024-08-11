import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReasonComponent } from './reason.component';

const routes: Routes = [
  { path: '', component: ReasonComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReasonRoutingModule { }
