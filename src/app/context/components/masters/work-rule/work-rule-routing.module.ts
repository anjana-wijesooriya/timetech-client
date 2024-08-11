import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkRuleComponent } from './work-rule.component';

const routes: Routes = [{ path: '', component: WorkRuleComponent, title: 'Work Rules' },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRuleRoutingModule { }
