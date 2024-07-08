import { take } from 'rxjs';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayComponent } from './holiday.component';
import { Title } from '@angular/platform-browser';

const routes: Routes = [
  { path: '', component: HolidayComponent, title: 'Holidays' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayRoutingModule { }
