import { Breadcrumb, BreadcrumbState, BreadcrumbStateService } from './../../../service/sharedstate/breadcrumb.state.service';
import { state } from '@angular/animations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { BasePlatform, ChartType, Colors, Plugin, ChartOptions, ChartData, } from 'chart.js';
import { } from 'node_modules/chartjs-plugin-datalabels/types/index'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Utils } from 'src/app/context/shared/utils';
import { IChartConfig } from 'src/app/context/shared/enum/chart.type';
import { BaseService } from 'src/app/context/service/base.service';
import { DashboardService } from '../../../service/dashboard.service';
import { AttendanceDetailsModel } from 'src/app/context/api/dashboard/attendance-details.model';
import { StateService } from 'src/app/context/service/sharedstate/state.service';
// import { BreadcrumbState } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { IconService } from 'src/app/context/service/icon.service';
import { IconTypes } from '../../../service/sharedstate/breadcrumb.state.service';
// import '../../../../../assets/context/images/avatar/onyamalimba.png'

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  years: any[] = ['2024', '2025', '2026'];
  options: any[] = ['Today', 'Month', 'Year'];
  value = [
    { label: 'Apps', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
    { label: 'Messages', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
    { label: 'Media', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
    { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
  ];

  selectedNodes!: TreeNode[];

  orgChartData: TreeNode[] = [
    {
      expanded: true,
      type: 'person',
      data: {
        image: '.../../../../../assets/context/images/avatar/amyelsner.png',
        name: 'Amy Elsner',
        title: 'CEO'
      },
      children: [
        {
          expanded: true,
          type: 'person',
          data: {
            image: '.../../../../../assets/context/images/avatar/annafali.png',
            name: 'Anna Fali',
            title: 'CMO'
          },
          // children: [{ label: 'UI/UX Design' } ]
        },
        {
          expanded: true,
          type: 'person',
          data: {
            image: '.../../../../../assets/context/images/avatar/stephenshaw.png',
            name: 'Stephen Shaw',
            title: 'CTO'
          },
          // children: [ { label: 'Development' } ]
        }
      ]
    }
  ];

  date: Date = new Date();
  loadingCards: any = {
    stats: true,
    statistics: true,
    attendanceChart: true,
    leaves: true,
    leavesChart: true,
    orgChart: true,
    exceptions: true
  };
  showProfile: boolean = false;
  overviewCharts: any = 'attendances'
  attendenceChartOptions: IChartConfig;
  WorkingHoursChartOptions: IChartConfig;

  attendanceDetails: AttendanceDetailsModel = new AttendanceDetailsModel();

  // @Inject('StateService') public state: StateService<BreadcrumbState>;

  constructor(private baseService: BaseService, private dashboardService: DashboardService,
    private breadcrumbState: BreadcrumbStateService
  ) {
  }



  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Self-Service', key: '1', icon: 'pi pi-share-alt' },
      { path: '/self-service/dashboard', label: 'Dashboard', key: '2', icon: 'pi pi-chart-bar' },
    ])
  }

  ngOnInit() {
    this.initBreadcrumbs()
    this.initLoadingStatuses()

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.initAttendanceChart();
    this.initWorkingHoursChart();
    this.getAttendanceSummery();

  }

  onChangeOptions() {

  }

  getAttendanceSummery() {
    {
      let date = new Date();
      let fromdate = new Date(date.getFullYear(), date.getMonth(), 1);
      let todate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var user = this.baseService.userDetails$.getValue();
      this.dashboardService.getAttendanceSummery(user.empId, fromdate.toISOString(), todate.toISOString()).subscribe(response => {

        this.attendanceDetails = response;
        this.attendanceDetails.attendanceSummery = this.attendanceDetails.attendanceSummery.map(a => ({ ...a, name: a.key }))
        // this.attendanceDetailsComponent.updateCharts(this.attendanceDetails);
      })
    }
  }

  initLoadingStatuses() {
    setTimeout(() => {
      this.loadingCards.stats = false;
    }, 5000);
    setTimeout(() => {
      this.loadingCards.statistics = false;
    }, 9000);
    setTimeout(() => {
      this.loadingCards.attendanceChart = false;
    }, 6000);
    setTimeout(() => {
      this.loadingCards.leaves = false;
    }, 8000);
    setTimeout(() => {
      this.loadingCards.leavesChart = false;
    }, 10000);
    setTimeout(() => {
      this.loadingCards.orgChart = false;
    }, 7000);
    setTimeout(() => {
      this.loadingCards.exceptions = false;
    }, 11000);
  }

  initAttendanceChart() {
    this.attendenceChartOptions = {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Off', 'Holiday', 'Leave'],
        datasets: [{
          backgroundColor: Utils.COLORS,
          label: 'Present',
          data: [13, 2, 5, 8, 3],
          datalabels: {
            display: true,
            anchor: 'end',
          }
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 5 / 3,
        layout: {
          padding: 5
        },
        plugins: {

          // colors: { enabled: true, forceOverride: true },
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.backgroundColor as string;
            },
            borderColor: 'white',
            borderRadius: 25,
            borderWidth: 2,
            color: 'white',
            display: (context) => {
              var dataset = context.dataset;
              var count = dataset.data.length;
              var value = dataset.data[context.dataIndex] as number;
              return value > count * 1.5;
            },
            font: {
              weight: 'bold'
            },
            padding: 6,
            formatter: Math.round,
          },
          legend: {
            position: 'right',
            align: 'center',
          }
        },

        elements: {
          line: {
            fill: false
          },
          point: {
            hoverRadius: 7,
            radius: 5
          }
        },
      },
      plugins: [
        ChartDataLabels,
        Colors,
      ]
    }
  }

  initWorkingHoursChart() {
    this.WorkingHoursChartOptions = {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            data: [8, 9.5, 7, 6, 10, 8.5, 9],
            borderColor: Utils.CHART_COLORS.blue,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            order: 1,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          },
          {
            label: 'Working Hours',
            data: [8, 9.5, 7, 6, 10, 8.5, 9],
            borderColor: Utils.CHART_COLORS.blue,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            order: 1,
            type: 'bar',
          },
          {
            data: [-0.5, -1, -0, -0.5, -2, -2.5 - 0.5,],
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            order: 0,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          },
          {
            label: 'Break Time',
            data: [-0.5, -1, -0, -0.5, -2, -2.5 - 0.5,],
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            type: 'bar',
            order: 0
          }
        ]
      },
      options: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },

        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            stacked: true,
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            stacked: true,
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          x: {
            // type: 'linear',
            display: true,
            // position: 'right',
            stacked: true,
            // grid line settings
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          }
        }
      }
    }
  }

}