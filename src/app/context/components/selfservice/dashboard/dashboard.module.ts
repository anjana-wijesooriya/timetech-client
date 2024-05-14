import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MeterGroupModule } from 'primeng/metergroup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { SkeletonModule } from 'primeng/skeleton';
import { SidebarModule } from 'primeng/sidebar';
import { CarouselModule } from 'primeng/carousel';
import { DashboardService } from 'src/app/context/service/dashboard.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent, title: 'Employee Dashboard' }
    ]),
    DropdownModule,
    MeterGroupModule,
    NgApexchartsModule,
    ChartModule,
    CalendarModule,
    AvatarGroupModule,
    AvatarModule,
    OrganizationChartModule,
    SkeletonModule,
    SidebarModule,
    CarouselModule,
    ChartModule
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
