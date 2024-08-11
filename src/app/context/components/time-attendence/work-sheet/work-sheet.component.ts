import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, TreeNode } from 'primeng/api';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { IReason } from 'src/app/context/api/time-attendance/reason.model';
import { IWorksheet } from 'src/app/context/api/time-attendance/worksheet.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { WorkRuleService } from 'src/app/context/service/workrule.service';
import { WorksheetService } from 'src/app/context/service/worksheet.service';

@Component({
  selector: 'app-work-sheet',
  templateUrl: './work-sheet.component.html',
  styleUrl: './work-sheet.component.scss'
})
export class WorkSheetComponent implements OnInit {
  companies: any;
  selectedCompany: any;
  departments: DepartmentModel[];
  departmentTree: TreeNode<any>[];
  selectedEmployees: any[] = [];
  employees: any[] = [];
  selectedReason: any = 0;
  reasons: any[] = [];
  fromDate: Date = new Date('08/01/2023');
  toDate: Date = new Date('09/05/2023');
  worksheets: IWorksheet[] = [];
  virtualWorksheets: IWorksheet[] = [];
  isLoading: boolean = false;
  selectedDepartments: any[] = [];
  rowsPerPage: number = 25;
  first: number = 0;
  empCode: string = "";
  empName: string = "";

  constructor(private worksheetService: WorksheetService, private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private employeeService: EmployeeService, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService) { }


  ngOnInit(): void {
    this.getCompanies();
    this.initBreadcrumbs();
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/shift', label: 'Daily Worksheet', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getCompanies() {
    this.isLoading = true;
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = res.find(a => a.compId == this.baseService.userDetails$.getValue().companyId);
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
          this.getDepartments();
          // this.onGetTableEntries();
          this.getEmployees();
          this.getResons();
          this.isLoading = false;
        }
      })
  }

  onChangeCompany() {
    this.getDepartments();
  }

  getEmployees() {
    const depIds = this.selectedDepartments.map(a => a.data).join(',');
    const userId = this.baseService.userDetails$.getValue().empId;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany.compId, depIds, userId)
      .subscribe(res => {
        this.employees = res
      }
      )
  }

  onGetTableEntries(name = '', code = ''): void {
    const userId = this.baseService.userDetails$.getValue().empId;

    const depIds = this.selectedDepartments.map(a => a.data).join(',');

    this.worksheetService.getWorksheets(this.selectedCompany.compId, this.selectedReason, userId, {
      from: this.fromDate, to: this.toDate, name: this.empName, code: this.empCode, deptIds: depIds, empIds: ''
    }).subscribe(res => {
      this.worksheets = res;
      this.virtualWorksheets = res//.slice(0, 25)
    });
  }

  processData() {
    const userId = this.baseService.userDetails$.getValue().empId;

    const depIds = this.selectedDepartments.map(a => a.data).join(',');

    this.worksheetService.processData(this.selectedCompany.compId, depIds, '', userId, this.fromDate.toISOString(), this.toDate.toISOString()).subscribe(res => {
      this.worksheets = res;
      this.virtualWorksheets = res//.slice(0, 25)
    });
  }

  transform(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}:${minutes}`;
  }

  getResons() {
    this.sharedService.getMastersData(6, [{ key: 'CompId', value: this.selectedCompany.compId.toString() }], false).subscribe(res => {
      this.reasons = res.map((a: IReason) => { return { ...a, color: a.color.substring(0, 7) } }) as IReason[];
    });
  }

  pageChange(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    //simulate remote connection with a timeout
    setTimeout(() => {
      //load data of required page
      let loadedData = this.worksheets.slice(event.first, event.first + event.rows);

      //populate page of virtual cars
      Array.prototype.splice.apply(this.virtualWorksheets, [...[event.first, event.rows], ...loadedData]);

      //trigger change detection
      event.forceUpdate();
    }, Math.random() * 1000 + 250);
  }

  onSearchWorksheets() {
    this.onGetTableEntries();
  }

  onEdit(data: any) {

  }

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(this.selectedCompany.compId).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        this.departmentTree.unshift(allCheckNode);
      }
    })
  }

  nodeSelect(event, departments = this.departmentTree) {
    if (event.node.label === 'All Departments') {
      departments.forEach(dep => {
        dep.checked = true;
        this.selectedDepartments.push(dep);
        if (dep.children && dep.children.length > 0) {
          this.nodeSelect(event, dep.children);
        }
      })
      this.getEmployees();
    }
  }

  nodeUnselect(event) {
    if (event.node.label === 'All Departments') {
      this.selectedDepartments = [];
      this.employees = [];
    }
  }

  deselectChildNodes(node: TreeNode) {
    if (node.children) {
      node.children.forEach(child => {
        const index = this.selectedDepartments.indexOf(child);
        if (index !== -1) {
          this.selectedDepartments.splice(index, 1);
        }
        this.deselectChildNodes(child);
      });
    }
  }

  nest(items: DepartmentModel[], id = 0, link = 'parentDepartmentId'): TreeNode[] {
    return items
      .filter(element => element.parentDepartmentId === id)
      .map(element => {
        const childrens = this.nest(items, element.departmentId);
        let treeModel: TreeNode = {
          key: element.departmentCode,
          data: element.departmentId,
          label: element.departmentName,
          children: childrens,

        };
        return treeModel;
      });
  }

}
