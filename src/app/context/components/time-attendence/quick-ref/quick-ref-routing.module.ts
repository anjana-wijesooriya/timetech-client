import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickRefComponent } from './quick-ref.component';

const routes: Routes = [
  { path: '', component: QuickRefComponent, title: 'Quick Ref' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickRefRoutingModule { }
