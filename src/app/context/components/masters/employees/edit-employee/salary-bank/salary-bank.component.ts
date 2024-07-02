import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';

@Component({
  selector: 'app-salary-bank',
  templateUrl: './salary-bank.component.html',
  styleUrl: './salary-bank.component.scss'
})
export class SalaryBankComponent implements OnInit {

  menuItemsTab: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  @ViewChild('form', { static: false }) form: NgForm;
  salary: any;
  currencies

  constructor(private breadcrumbState: BreadcrumbStateService, private alert: AlertService, private employeeState: EmployeeStateService,
    private employeeService: EmployeeService, private route: ActivatedRoute, private confirm: ConfirmationService,
    private baseService: BaseService) { }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.menuItemsTab = [
      { label: 'Salary', icon: 'ic i-ID-Card' },
      { label: 'Bank', icon: 'ic i-Male' },
      { label: 'Hold Salary', icon: 'ic i-Support' },
      { label: 'Provision', icon: 'ic i-Cube-Molecule-2' },
    ];
    this.activeItem = this.menuItemsTab[0];
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/employees', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
      { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-UserStar' },
      { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}/time-attendance`, label: 'Time Attendance', key: '4', icon: 'font-medium ic i-Time-Window' },
    ]);
  }

  onSubmit() {

  }

}
