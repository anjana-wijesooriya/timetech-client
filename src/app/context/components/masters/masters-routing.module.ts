import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    // { path: '**', redirectTo: '/masters/employees', pathMatch: 'prefix' },
    { path: 'hr-personal', redirectTo: 'employees' },
    { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule) },
    { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule) },

];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MastersRoutingModule { }
