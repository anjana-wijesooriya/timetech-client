import { Component, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PairValue } from 'src/app/demo/api/dashboard/attendance-details.model';
import { EmployeeGridModel } from 'src/app/demo/api/master/employee-grid.model';
import { BaseService } from 'src/app/demo/service/base.service';
import { DashboardService } from 'src/app/demo/service/dashboard.service';
import { BreadcrumbStateService } from 'src/app/demo/service/sharedstate/breadcrumb.state.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/demo/shared/directives/sortable-header.directive';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  // encapsulation: ViewEncapsulation.Emulated
})
export class EmployeesComponent implements OnInit {

  _employees: EmployeeGridModel[] = [];
  _departmentCode: string = '';
  filteredEmployees: EmployeeGridModel[] = [];
  selectedColumns: any[] = [];
  columns: any[];
  @Input()
  get employees(): EmployeeGridModel[] { return this._employees };
  set employees(value: EmployeeGridModel[]) {

    this._employees = value.map(a => {
      a.designationObj = { value: a.designation, key: '', name: a.designation };
      a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };
      a.isActive = a.active.indexOf('forestgreen') > -1
      return a;
    });
    this.filteredEmployees = value;
    this.userProfiles = Object.keys(this.groupBy(value, 'userProfile')).map((e => { return { name: e, value: e, key: '' } }));
    this.designations = Object.keys(this.groupBy(value, 'designation')).map((e => { return { name: e, value: e, key: '' } }));
  }
  @Input() allEmployees: EmployeeGridModel[] = [];
  @Input() headerText: string = '';
  @Input()
  get departmentCode(): string { return this._departmentCode }
  set departmentCode(value: string) {
    this._departmentCode = value;
    this._employees = this.allEmployees.filter(emp => emp.deptCd == value)
  }

  userProfiles: PairValue[] = []
  designations: PairValue[] = []

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  page = 1;
  pageSize = 5;
  collectionSize = this.filteredEmployees.length;
  searchText: string = "";
  allDepartments: boolean = false;
  exactMatch: any = false;
  tempEmp: EmployeeGridModel[] = [];
  _tempEmp: EmployeeGridModel[] = [];
  isLoading: boolean = false;

  constructor(private baseService: BaseService, private dashboardService: DashboardService,
    private breadcrumbState: BreadcrumbStateService) {

  }

  ngOnInit(): void {
    this.initBreadcrumbs();

    this.columns = [
      { field: "empName", header: "Name" },
      { field: "userProfileObj.name", header: "User Profile" },
      { field: "designationObj.name", header: "Designation" },
      { field: "nationalID", header: "National Id" },
      { field: "email", header: "Email" },
      { field: "active", header: "Status" },
    ];
    this.selectedColumns = this.columns;
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/hr-personal', label: 'All Employees', key: '2', icon: 'pi pi-chart-bar' },
    ]);
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

  onSort(event: any) {
    let sortEvent: SortEvent = event as SortEvent;
    let { column, direction } = sortEvent
    // resetting other headers
    for (const header of this.headers) {
      if (header.sortable !== column) {
        header.direction = '';
      }
    }

    // sorting countries
    // if (direction === '' || column === '') {
    // 	this.filteredEmployees = this.filteredEmployees;
    // } else {
    // 	this.filteredEmployees = [...this.filteredEmployees].sort((a, b) => {
    // 		const res = compare(a[column as keyof EmployeeGridModel], b[column  as keyof EmployeeGridModel]);
    // 		return direction === 'asc' ? res : -res;
    // 	});
    // }
  }

  refresh() {
    this.tempEmp = this.filteredEmployees.map((item, i) => ({ id: i + 1, ...item })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  onPaginationChange(event: any[]) {
    this._tempEmp = event
  }

  onSearch() {
    const searchEmployees = this.allDepartments ? this.allEmployees : this.employees;
    if (this.searchText == '') {
      this.filteredEmployees = this.employees;
      this.tempEmp = this.employees;
    } else {
      this.filteredEmployees = searchEmployees.filter((item) => {
        const term = this.searchText.toLowerCase();
        if (this.exactMatch) {
          return (
            item.empCd.toLowerCase() == (term) ||
            (item.empName).toLowerCase() == (term) ||
            (item.userProfile && (item.userProfile).toLowerCase() == (term)) ||
            (item.designation && (item.designation).toLowerCase() == (term)) ||
            (item.nationalID && (item.nationalID).toLowerCase() == (term))
          );
        } else {
          return (
            item.empCd.toLowerCase().includes(term) ||
            (item.empName).toLowerCase().includes(term) ||
            (item.userProfile && (item.userProfile).toLowerCase().includes(term)) ||
            (item.designation && (item.designation).toLowerCase().includes(term)) ||
            (item.nationalID && (item.nationalID).toLowerCase().includes(term))
          );
        }
      });
    }
    this.refresh();
  }

  onSearchAllDepartments() {
    if (this.allDepartments || this.departmentCode == '') {
      this._employees = this.allEmployees.map(a => {
        a.designationObj = { value: a.designation, key: '', name: a.designation };
        a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };
        a.isActive = a.active.indexOf('forestgreen') > -1
        return a;
      });
    } else {
      this._employees = this.allEmployees.filter(emp => emp.deptCd == this.departmentCode).map(a => {
        a.designationObj = { value: a.designation, key: '', name: a.designation };
        a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };
        a.isActive = a.active.indexOf('forestgreen') > -1
        return a;
      });
    }
  }

  get searchHeader() {
    let text = '';
    if (this.searchText != '') {
      text = `"${this.searchText}" `
      if (this.allDepartments) {
        text = text + "in all Departments ";
      }
      if (this.exactMatch) {
        text = text + 'with exact match';
      }
    } else {
      text = this.headerText;
    }
    return text;
  }

  get filteredEmployeeCount() {
    return this.filteredEmployees.length;
  }

  onMailToClick(mail: string) {
    window.location.href = mail;
  }

  isShowColumn(field: string) {
    return this.selectedColumns.filter(a => a.field == field).length > 0
  }

}
