import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { WorksheetService } from 'src/app/context/service/worksheet.service';
import { Popover } from 'primeng/popover';
import { EmployeeService } from 'src/app/context/service/employee.service';

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
  selectedDepartment: any;
  employees: any;
  groupedEmployees: any[] = [];
  selectedEmployee: any;
  departmentTree: TreeNode<any>[];
  departments: DepartmentModel[];
  isLoading: boolean;
  shifts: any[];
  workRules: any;
  addForm: FormGroup = new FormGroup({});
  selectedDepartments: any;
  selectedDetails: any[] = [];
  dateRange: Date[] = [new Date(), new Date()];
  // @ViewChild('op') op!: Popover;
  detailsLoading: boolean;
  showDetails: boolean = false;
  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private shiftService: ShiftService, private datepipe: DatePipe, private worksheetService: WorksheetService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.table = createAngularTable(() => ({
      data: this.data(),
      columns: this.getColumns(),
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
    }))
    this.bindForm();
    this.getCompanies();
    this.getEntries(true);
    this.onInitBreadcrumbs();
  }

  onInitBreadcrumbs(): void {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/schedule-shift-or-workrule', label: 'Add Schedule for Shift or Workrule', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
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

  bindForm() {
    this.addForm = this.fb.nonNullable.group({
      fWR: new FormControl('',Validators.required),
      offDay: new FormControl('',Validators.required),
      muslim: new FormControl('',Validators.required),
      sWR: new FormControl('',Validators.required), 
      sShift: new FormControl('',Validators.required),
      narration: new FormControl('',Validators.required),
      compId: new FormControl(this.baseService.userDetails$.getValue().companyId)
    })
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res;
          this.selectedCompany = this.baseService.userDetails$.getValue().companyId;
          this.onChangeCompany();
          
          // this.getEmployees();
        }
      })
  }  

  onChangeCompany() {
    this.getDepartments();
    this.getEmployees();
    this.getWorkRules();
    this.getShifts();
  }

  hidePopover() {
    // this.op.hide();
  }

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(this.selectedCompany).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        // const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        // this.departmentTree.unshift(allCheckNode);
        this.selectedDepartment = [];
      }
    })
  }

  onSave() {
    if (this.addForm.valid) {
      var obj = this.addForm.value;
      obj.startDate = this.dateRange[0];
      obj.endDate = this.dateRange[1];
      obj.userId = this.baseService.userDetails$.getValue().id;
      obj.deptIds = this.selectedDepartments.map(a => a.data).join();
      obj.empIds = this.selectedEmployee.map(a => a.data).join();
      this.loading = true;
      this.shiftService.SaveShiftWorkrule(obj.compId, obj.userId, false, 0, false, obj.startDate, obj.endDate, obj.deptIds, obj.empIds, obj.fWR,
        obj.offDay, obj.muslim, obj.sWR, obj.sShift, obj.narration).subscribe(res => {
          this.alert.success('Record has been Saved');
          this.showAddNewPanel = !this.showAddNewPanel;
          this.loading = false;
        }, err => {
          this.loading = false;
          this.alert.error(err);
          this.showAddNewPanel = !this.showAddNewPanel;
        })
    }
  }

  viewData(event: Event, { compID, docNo, shiftName, workrule }: any) {
    this.detailsLoading = true;
    this.showDetails = true
    this.shiftService.getShiftWorkruleDetails(compID, docNo)
      .subscribe({
        next: res => {
          this.detailsLoading = false;
          this.selectedDetails = res.map(a => {
            a.shiftName = shiftName;
            a.workrule = workrule;
            return a;
          });
          
        }
      })
  }

  deleteConfirm(event: Event, data: any) {
    this.isLoading = true
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "pl-2 p-button-primary",
      rejectButtonStyleClass: "p-button-danger p-button-text p-button-outlined",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        // this.isSavingSlideData = true;//
        const { compId } = this.selectedCompany;
        const { id } = this.baseService.userDetails$.getValue()
        data.isDelete = true;
        this.isLoading = true
        this.shiftService.deleteShiftWorkrule(this.selectedCompany, data.docNo, id, true).subscribe(res => {
          this.alert.success('Record Deleted');
          this.getEntries();
          this.isLoading = false;
        }, err => {
          this.alert.error(err);
          this.isLoading = false;
        })
      },
      reject: () => {
        // this.isLoading = false;//
        // this.alert.error('');
      }
    });
  }

  rollbackConfirm(event: Event, data: any) {
    this.isLoading = true
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to rollback this record?',
      header: 'Rollback Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "pl-2 p-button-primary",
      rejectButtonStyleClass: "p-button-danger p-button-text p-button-outlined",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        // this.isSavingSlideData = true;//
        const { id } = this.baseService.userDetails$.getValue()
        data.isDelete = true;
        
        this.shiftService.deleteShiftWorkrule(this.selectedCompany, data.docNo, id, false).subscribe(res => {
          this.alert.success('Rocord Rollbacked')
          this.getEntries();
          this.isLoading = false;
        }, err => {
          this.alert.error(err);
          this.isLoading = false;
        })
      },
      reject: () => {
        // this.isLoading = false;//
        // this.alert.error('');
      }
    });
  }

  onChangeDepartment(event: TreeNodeSelectEvent) {
    this.getEmployees();
  }

  expandAll() {
    this.departmentTree.forEach((node) => {
      this.expandRecursive(node, true);
    });
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

  nodeSelect({ node }: any) {
    this.groupedEmployees = this.employees.filter(b => this.selectedDepartments.map(a => a.data).includes(b.deptId))
  }

  nodeUnselect(event: any) {
    this.groupedEmployees = this.employees.filter(b => this.selectedDepartments.map(a => a.data).includes(b.deptId))
  }

  getEmployees() {
    this.isLoadingEmployees = true
    const userId = this.baseService.userDetails$.getValue().id;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany, "", userId)
      .subscribe(res => {
        this.employees = res
        this.isLoadingEmployees = false;
        this.selectedEmployee = [];
        this.groupedEmployees = [];
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
    this.bindForm();
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
