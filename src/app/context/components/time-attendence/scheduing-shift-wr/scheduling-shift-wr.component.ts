import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { ShiftService } from 'src/app/context/service/shift.service';


@Component({
  selector: 'app-scheduling-shift-wr',
  templateUrl: './scheduling-shift-wr.component.html',
  styleUrl: './scheduling-shift-wr.component.scss'
})
export class SchedulingShiftWrComponent implements OnInit {
  loading: boolean;
  entries: any[] = [];
  table: any;
  selectedCompany: any = this.baseService.userDetails$.getValue();
  data = signal(this.entries);
  tableEntries: any[] =[];
  companies: CompanyModel[] = [];
  stateOptions: any[] = [{ label: 'Active', value: false }, { label: 'Inactive', value: true }];
  selectedStatus: any = false;
  showAddNewPanel: boolean = false;
  isLoadingEmployees: boolean;
  worksheetService: any;
  selectedDepartment: any;
  employees: any;
  selectedEmployee: any;
  departmentTree: TreeNode<any>[];
  departments: DepartmentModel[];
  isLoading: boolean;
  shifts: any[];
  employeeService: any;
  workRules: any;
  addForm: FormGroup = new FormGroup({});
  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private shiftService: ShiftService, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.table = createAngularTable(() => ({
      data: this.data(),
      columns: this.getColumns(),
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
    }))
    this.getCompanies();
    this.getEntries(true);
  }

  getEntries(onload:boolean = false) {
    this.loading = true;
    const { companyId, id } = this.baseService.userDetails$.getValue(); 
    this.shiftService.getShiftWorkrule(onload ? companyId : this.selectedCompany, id, this.selectedStatus).subscribe(res => {
      this.tableEntries = res;
      this.data.set(this.entries);
      this.loading = false;
    })
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res;
          this.selectedCompany = this.baseService.userDetails$.getValue().companyId;
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
        }
      })
  }  

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(this.selectedCompany.compId).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        // const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        // this.departmentTree.unshift(allCheckNode);
        this.selectedDepartment = tree[0];
        this.getEmployees();
      }
    })
  }

  onChangeDepartment(event: TreeNodeSelectEvent) {
    this.getEmployees();
  }

  getEmployees() {
    this.isLoadingEmployees = true
    const userId = this.baseService.userDetails$.getValue().empId;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany, this.selectedDepartment.data.toString(), userId)
      .subscribe(res => {
        this.employees = res
        this.selectedEmployee = res.length > 0 ? res[0]?.empID : 0;
        this.isLoadingEmployees = false;
      }
      )
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

  getShifts(companyId = 0) {
    this.isLoading = true;
    let filters = [];
    filters.push({ "key": "CompId", "value": companyId.toString() });
    filters.push({ "key": "DeptId", "value": "0" });
    this.sharedService.getMastersData(4, filters, false).subscribe(res => {
      this.isLoading = false;
      this.shifts = res as any[];
    })
  }

  getWorkRules(companyId = 0) {
    this.isLoading = true;
    this.employeeService.getWorkRules(companyId).subscribe(res => {
      this.workRules = res;
      this.isLoading = false;
    })
  }

  onClickAdd(){
    this.showAddNewPanel = !this.showAddNewPanel;
  }

  getColumns() {
    return [
      { accessorKey: 'docNo', header: () => 'Doc No' },
      { accessorKey: 'fromDt', header: () => 'From', cell: info => this.datepipe.transform(info.getValue(), 'dd-MM-yyyy') },
      { accessorKey: 'toDt', header: () => 'To' },
      { accessorKey: 'havingWR', header: () => 'Having Workrule' },
      { accessorKey: 'shiftName', header: () => 'Shift' },
      { accessorKey: 'workrule', header: () => 'Workrule' },
      { accessorKey: 'muslim', header: () => 'Muslim Only' },
      { accessorKey: 'createdBy', header: () => 'Creator' },
      { accessorKey: 'createdOn', header: () => 'Deleted' },
      { accessorKey: 'deleted', header: () => 'DeletedBy' },
      { accessorKey: 'deletedBy', header: () => 'Rollbacked' },
      { accessorKey: 'allDept', header: () => 'All Dept' },
      { accessorKey: 'allEmp', header: () => 'All Emp' },
      { accessorKey: 'canDeleted', header: () => 'Rollback' },
      { accessorKey: 'canRollback', header: () => 'Actions' },
    ]
  }

}
