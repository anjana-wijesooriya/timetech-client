import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, FilterService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { EditEmployeeModel } from 'src/app/context/api/company/edit-employee.model';
import { LeaveType } from 'src/app/context/api/company/leave.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.scss'
})
export class LeavesComponent implements OnInit {
  employee: EditEmployeeModel = new EditEmployeeModel();
  leaves: any[] = [];
  breakups: any[] = [];
  isLoading: boolean = false;
  isLoadingBreakups: boolean = false;
  leaveHistoryColumns: any[] = ['Start Date', 'End Date', 'Leave Days', 'Remarks'];
  leaveBreakUpColumns: any[] = ['Year', 'Start Date', 'Total Working Days', 'Opening Leave',
    'Total Leaves', 'Leaves Taken', 'Leaves Balance', 'Leaves Carry Forwarded'
  ];
  showHistroy: boolean = false;
  frozenRows: any[] = [];
  expandedRows: any = {};
  isLoadingHistory: boolean = false;
  history: any[] = [];
  showAddLeave: boolean = false;
  selectedLeaveOption: any = undefined;
  leaveTypes: any[] = [];
  selectedType: LeaveType = new LeaveType();
  @ViewChild('form', { static: false }) form: NgForm;
  isSaving: boolean = false;

  constructor(private baseService: BaseService, private employeeService: EmployeeService,
    private breadcrumbState: BreadcrumbStateService, private alert: AlertService,
    private employeeState: EmployeeStateService, private confirmationService: ConfirmationService,
    public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEmployeeInfo();
    this.initBreadcrumbs();
    this.getLeaves();
    // this.getLeavesType();
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/employees', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
      { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-UserStar' },
      { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}/leaves`, label: 'Leaves', key: '4', icon: 'font-semibold ic i-Home-4' },
    ]);
  }

  getEmployeeInfo() {
    this.employeeState.getEmployees().subscribe(res => {
      if (res && res?.employeeDetails) {
        this.employee = res.employeeDetails;
        this.getLeavesType();
      }
    })
  }

  getLeaves() {
    const empId = this.route.parent.snapshot.paramMap.get('id') as any;
    this.isLoading = true;
    this.employeeService.getLeaves(empId).subscribe(res => {
      this.leaves = res
      this.isLoading = false;
    });
  }

  deleteConfirm(event: Event, leaveType: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",

      accept: () => {
        this.isLoading = true;
        this.employeeService.deleteLeaveType(this.employee.empID, leaveType).subscribe(res => {
          this.alert.success('Record deleted');
          this.getLeaves();
        });
      },
      reject: () => {
        // this.alert.success('Record deleted');
      }
    });
  }

  editLeaveOption(option: any) {
    const empId = this.route.parent.snapshot.paramMap.get('id') as any;
    const type = option.leaveCd;
    this.showAddLeave = !this.showAddLeave
    this.selectedType = new LeaveType();
    this.employeeService.getLeaveTypeDetails(empId, type).subscribe(res => {
      this.selectedType = res as any;
      this.selectedType.yearlyDays = res.firstDays
      this.selectedType.secondDays = res.firstDays
      this.selectedType.isCalenderDays = res.isCalenderDays
      this.selectedType.leaveCarryForward = res.leaveCarryForward
      this.selectedType.leaveCarryForwardLimit = res.leaveCarryForwardLimit
      this.selectedType.leaveCarryForwardLimitUpTo = res.leaveCarryForwardLimitUpTo
      this.selectedType.leaveEligibleForFullServiceYear = res.leaveEligibleForFullServiceYear
      this.selectedType.leaveEligibleForFullYear = res.leaveEligibleForFullYear
      this.selectedType.openLeaveDays = res.openLeaveDays
      this.selectedType.hasOpeningLeave = res.hasOpeningLeave
      this.selectedType.openLeaveEffectiveDate = res.openLeaveEffectiveDate
      // this.selectedType.leave = res.isEligible
      this.form.controls['leaveCd'].disable();
      this.onModelChange(this.form);
    })

  }

  onChangeLeaveType() {
    const empId = this.route.parent.snapshot.paramMap.get('id') as any;
    const type = this.form.controls['leaveCd'].value;
    // this.employeeService.getLeaveTypeDetails(empId, type).subscribe(res => {
    //   this.selectedType = res;
    // })
  }

  onOpenSlide() {
    this.showAddLeave = !this.showAddLeave
    this.selectedType = new LeaveType();
    // this.onModelChange(this.form);
    // this.onChangeLeaveType();
  }

  onSubmit() {
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      const empId = this.route.parent.snapshot.paramMap.get('id') as any;
      const user = this.baseService.userDetails$.getValue();
      let type = new LeaveType();
      type = this.selectedType;
      type.empId = empId;
      type.secondDays = this.selectedType.yearlyDays;
      type.firstDays = this.selectedType.yearlyDays;
      type.firstYears = this.selectedType.yearlyDays;
      type.isEligible = true;
      this.isSaving = true;
      this.employeeService.saveLeaveType(user.id, type).subscribe(
        res => {
          this.isSaving = false;
          this.alert.success('Employee Leave data has been saved.')
          this.showAddLeave = !this.showAddLeave;
          this.getLeaves();
        },
        err => {
          this.isSaving = false;
          this.alert.error(err);
        }
      )
    }
  }

  onModelChange(form: NgForm) {
    if (this.form.controls['leaveCarryForwardLimit'].value) {
      this.form.controls['leaveCarryForwardLimitUpTo'].enable();

    } else {
      this.form.controls['leaveCarryForwardLimitUpTo'].disable();
    }

    if (this.form.controls['hasOpeningLeave'].value) {
      this.form.controls['openLeaveDays'].enable();
      this.form.controls['openLeaveEffectiveDate'].enable();
    } else {
      this.form.controls['openLeaveDays'].disable();
      this.form.controls['openLeaveEffectiveDate'].disable();
    }
    this.form.control.updateValueAndValidity();
  }

  toggleLock(data: any, frozen: boolean, index: number) {
    if (frozen) {
      this.leaves = this.leaves.filter((c, i) => i !== index);
      this.frozenRows.push(data);
    } else {
      this.frozenRows = this.frozenRows.filter((c, i) => i !== index);
      this.leaves.push(data);
    }

    this.frozenRows.sort((val1, val2) => {
      return val1.id < val2.id ? -1 : 1;
    });

    this.leaves.sort((val1, val2) => {
      return val1.id < val2.id ? -1 : 1;
    });
  }

  getHistory(leaveType: number) {
    this.showHistroy = !this.showHistroy;
    this.history = [];
    this.isLoadingHistory = true;
    const empId = this.route.parent.snapshot.paramMap.get('id') as any;
    this.employeeService.getLeaveHistory(empId, leaveType).subscribe(res => {
      this.isLoadingHistory = false;
      this.history = res;
    })
  }

  getLeavesType() {
    this.employeeService.getLeaveTypes(this.employee.compCd).subscribe(
      res => {

        this.leaveTypes = res;
        this.leaveTypes = this.leaveTypes.sort((val1, val2) => {
          return val1.id < val2.id ? -1 : 1;
        });
      }
    )
  }

  onChangeType(event: DropdownChangeEvent) {
    console.log(event.value)
    const option = this.leaveTypes.find(a => a.code == event);
    // this.onChangeLeaveType();
    this.selectedType.yearlyDays = option.defaultDays;
    this.selectedType.firstNYears = option.firstPartYears;
    this.selectedType.defaultSecondDays = option.defaultSecondDays;
    this.selectedType.leaveCarryForward = option.leaveCarryForward;
    this.selectedType.leaveCarryForwardLimit = option.leaveCarryForwardLimit;
    this.selectedType.leaveCarryForwardLimitUpTo = option.leaveCarryForwardLimitUpTo;
    this.selectedType.leaveEligibleForFullServiceYear = option.leaveEligibleForFullServiceYear;
    this.selectedType.isCalenderDays = option.isCalenderDays;
    this.selectedType.leaveEligibleForFullYear = option.leaveEligibleForFullYear;

    this.onModelChange(this.form)
  }
  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {};
    this.expandedRows[event.data.leaveCd] = true;
    const empId = this.route.parent.snapshot.paramMap.get('id') as any;
    this.isLoadingBreakups = true;
    this.employeeService.getLeaveBreakup(empId, event.data.leaveCd).subscribe(res => {
      this.breakups = res;
      this.isLoadingBreakups = false;
    })
    // this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    // this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }

}
