import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { IconTypes } from '../../service/sharedstate/breadcrumb.state.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DashboardComponent,
                data: { breadcrumb: { path: '', label: 'Dashboard', key: '1', icon: 'pi pi-chart-bar' } }
            }
        ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
