import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkSheetComponent } from './work-sheet.component';

const routes: Routes = [
  { path: '', component: WorkSheetComponent, title: 'Daily Work Sheet' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkSheetRoutingModule { }
