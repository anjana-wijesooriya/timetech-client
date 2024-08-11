import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HolidayModule } from './holiday/holiday.module';

const routes: Routes = [
    // { path: '**', redirectTo: 'time-attendance', pathMatch: 'prefix' },
    { path: 'hr-personal', redirectTo: 'employees' },
    { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule) },
    { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule) },
    { path: 'holidays', loadChildren: () => import('./holiday/holiday.module').then(m => m.HolidayModule) },
    { path: 'work-rule', loadChildren: () => import('./work-rule/work-rule.module').then(m => m.WorkRuleModule) },

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MastersRoutingModule { }
