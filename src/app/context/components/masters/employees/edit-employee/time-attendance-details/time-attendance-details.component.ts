import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { EditEmployeeModel } from 'src/app/context/api/company/edit-employee.model';
import { WorkRuleModel } from 'src/app/context/api/company/employee-support-data.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeState, EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';

@Component({
  selector: 'app-time-attendance-details',
  templateUrl: './time-attendance-details.component.html',
  styleUrl: './time-attendance-details.component.scss'
})
export class TimeAttendanceDetailsComponent implements OnInit {
  isSaving: boolean = false;
  employee: EditEmployeeModel = new EditEmployeeModel();
  workRules: WorkRuleModel[] = [];
  showWorkRuleReport: boolean = false;
  workRuleDetails: any[];

  constructor(private breadcrumbState: BreadcrumbStateService, private alert: AlertService, private employeeState: EmployeeStateService,
    private employeeService: EmployeeService, private route: ActivatedRoute, private confirm: ConfirmationService,
    private baseService: BaseService) { }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.employeeState.getEmployeeState().subscribe(data => {
      if (data && data?.employeeDetails) {
        let res = data?.employeeDetails;
        res.workRuleStartDt = res?.workRuleStartDate ? new Date(res?.workRuleStartDate) : null;
        this.employee = res;
      }
    });
    this.getWorkRules();
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

  getWorkRules() {
    // this.spinner.show();
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getWorkRules(companyId).subscribe(response => {
      this.workRules = response
      // this.spinner.hide();
    })
  }

  getWorkRuleReport() {
    // this.spinner.show();
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getWorkRuleReport(companyId, this.employee.wrkRulCd).subscribe(response => {
      this.workRuleDetails = response.sort((a, b) => (a.daySeq - b.daySeq));

      // console.log(this.groupBy(response, 'nameOfDay'));
      // this.spinner.hide();
    })
  }

  onModelChange(form: NgForm) {
    if (this.employee.wrkRulCd == 0 || this.employee.wrkRulCd == null) {
      form.controls['workRuleStartDt']?.setValidators([Validators.required]);
    } else {
      form.controls['workRuleStartDt']?.clearValidators();
    }
    form.control.get('workRuleStartDt')?.updateValueAndValidity();
    form.control.get('workRuleStartDt')?.markAsTouched();
  }

  onSubmit(form: NgForm) {
    this.isSaving = true;
    if (form.valid) {
      const loggedUser = this.baseService.userDetails$.getValue();
      this.employee.isMachineAdmin = form.controls['kjAdmin'].value == 1 ? true : false;
      this.employeeService.updateTimeAttendanceDetails(this.employee, loggedUser.empId)
        .subscribe(res => {
          this.isSaving = false;
          this.alert.success('Time attendance details updated.');

        }, er => {
          this.isSaving = false;
          this.alert.error(er);
        }, () => {
          this.isSaving = false;
        });
    }
  }

  groupBy(array: any[], key: any) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      ; (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      )
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result
    }, {}) // empty object is the initial value for result object
  }
}
