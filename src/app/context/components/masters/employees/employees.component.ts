import { NodeService } from 'src/app/context/service/node.service';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FilterService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { PairValue } from 'src/app/context/api/dashboard/attendance-details.model';
import { EmployeeGridModel } from 'src/app/context/api/master/employee-grid.model';
import { BaseService } from 'src/app/context/service/base.service';
import { DashboardService } from 'src/app/context/service/dashboard.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/context/shared/directives/sortable-header.directive';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { Utils } from 'src/app/context/shared/utils';

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
  filter: any;
  isExpand: boolean = true;;
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
    this.designations = Object.keys(this.groupBy(value, 'designation')).map((e => { return { name: e == null ? 'Not Assigned' : e, value: e, key: '' } }));
    this.deps = Object.keys(this.groupBy(value, 'deptDs')).map((e => { return { name: e, value: e, key: '' } }));
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
  deps: PairValue[] = []


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
  showDepartments: boolean = false;
  departmentTree!: TreeNode[];
  selectedDepartments: TreeNode[] = [];
  companies: CompanyModel[] = [];
  departments: DepartmentModel[] = [];
  selectedComapny: number;
  showProfile: boolean = false;
  showAddSlide: boolean = false;
  isBoxLayout: boolean = false;
  @ViewChild(AddEmployeeComponent) addEmployeeComponent!: AddEmployeeComponent;

  constructor(private baseService: BaseService, private employeeService: EmployeeService,
    private breadcrumbState: BreadcrumbStateService, private filterService: FilterService,
    private employeeState: EmployeeStateService, private companyService: CompanyService,
    public router: Router, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.initBreadcrumbs();

    this.columns = [
      { field: "empName", header: "Name" },
      { field: "userProfileObj.name", header: "User Profile" },
      { field: "designationObj.name", header: "Designation" },
      { field: "deptDs", header: "Department" },
      { field: "nationalID", header: "National Id" },
      { field: "email", header: "Email" },
      { field: "active", header: "Status" },
    ];
    this.selectedColumns = this.columns;
    this.getCompanies();
  }

  get resolution() {
    return window.innerWidth < 993;
  }

  showAddEmployeeSlide() {
    this.showAddSlide = true;
    setTimeout(() => {
      this.addEmployeeComponent.showSlide = true;
    }, 100);
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/hr-personal', label: 'All Employees', key: '2', icon: 'pi pi-chart-bar' },
    ]);
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          res
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedComapny = res[0].compId;
          this.onChangeCompany(this.selectedComapny);
          this.getEmployees();
        }
      })
  }

  onChangeCompany(companyId: number) {
    this.companyService.getDepartments(this.selectedComapny).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        this.departmentTree.unshift(allCheckNode)
        //this.getEmployees();
      }
    })
  }

  onDepartmentSelected(event: any) {
    if (event.node.key == 'ALL' && event.node.checked) {
      this.selectedDepartments = [];
      this.checkAllDepartments(this.departmentTree, true);
      this._employees = this.employeeState.employees;
    } else if (event.node.key == 'ALL' && !event.node.checked) {
      // let tree = this.nest(this.departments, false);
      // const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
      // this.departmentTree = tree;
      // this.departmentTree.unshift(allCheckNode)
      this.selectedDepartments = [];
      this._employees = this.employeeState.employees;
    } else {
      if (this.selectedDepartments.length > 0) {
        const departmentIds = this.selectedDepartments.map(a => a.key.toLowerCase());
        const emps = this.employeeState.employees.filter(node => departmentIds.some(a => a == node.deptCd.toLowerCase()))
        console.log(emps)
        this._employees = emps;
      } else {
        this._employees = this.employeeState.employees;
      }
    }
  }

  checkAllDepartments(departmentList: TreeNode[], isChecked: boolean) {
    if (isChecked) {
      departmentList.forEach(node => {
        this.selectedDepartments.push(node);
        if (node.children) {
          this.checkAllDepartments(node.children, isChecked);
        }
      });
    }
    else {
      this.selectedDepartments = [];
    }
  }

  getEmployees() {
    const userdetails = this.baseService.userDetails$.getValue();
    this.showAddSlide = false;
    this.isLoading = true;
    this.employeeService.getEmployees(userdetails.id, this.selectedComapny).subscribe({
      next: res => {
        this.employees = res.map(a => {
          if (a.imagePath == null || a.imagePath == undefined || a.imagePath == '') {
            a.imagePath = '';
            return a;
          }
          a.imagePath = ((a.imagePath.includes('.png') || a.imagePath.includes('.jpg'))
            && (a.imageStream == null || a.imageStream == '')) ? this.baseService.apiEndpoint + a.imagePath
            : this.byteArrayToImage(a.imageStream);
          return a;
        });
        this.employeeState.setEmployees(this.employees);
        this.isLoading = false;
        // this.filteredEmployeesEmitter.emit(res);
        // this.allEmployeesEmitter.emit(res);
      }
    });
  }

  byteArrayToImage(imageString: any) {
    // const blob = new Blob([bytes], { type: 'image/jpg' }); // Replace 'image/png' with the actual MIME type
    // const imageUrl = URL.createObjectURL(blob);
    return "data:image/png;base64," + imageString;
  }

  nest(items: DepartmentModel[], id = 0, link = 'parentDepartmentId'): TreeNode[] {
    return items
      .filter(element => element.parentDepartmentId === id)
      .map(element => {
        const childrens = this.nest(items, element.departmentId);
        let treeModel: TreeNode = {
          icon: '<i class="i-Assistant"></i>',
          key: element.departmentCode,
          label: element.departmentName,
          checked: false,
          children: childrens
        };
        return treeModel;
      });
  }

  expandAll() {
    this.departmentTree.forEach((node) => {
      this.expandRecursive(node, this.isExpand);
    });
    this.isExpand = !this.isExpand;
  }

  collapseAll() {
    this.departmentTree.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  showFilterMenu() {
    this.showDepartments = !this.showDepartments;
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
        // a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };
        a.isActive = a.active.indexOf('forestgreen') > -1
        return a;
      });
    } else {
      this._employees = this.allEmployees.filter(emp => emp.deptCd == this.departmentCode).map(a => {
        a.designationObj = { value: a.designation, key: '', name: a.designation };
        a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };
        // a.userProfileObj = { value: a.userProfile, key: '', name: a.userProfile };

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

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
