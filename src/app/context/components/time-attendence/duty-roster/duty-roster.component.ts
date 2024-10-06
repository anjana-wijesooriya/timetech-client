import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { DutyRosterService } from 'src/app/context/service/duty-roster.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { WorksheetService } from 'src/app/context/service/worksheet.service';
import { Utils } from '../../../shared/utils';
import { Event } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Overlay } from 'primeng/overlay';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-duty-roster',
  templateUrl: './duty-roster.component.html',
  styleUrl: './duty-roster.component.scss'
})
export class DutyRosterComponent implements OnInit {

  months: []
  selectedMonth: Date = new Date("2023-08-01");
  company: string = 'TimeTech Bahrain Co';
  department: string = '--Select--';
  employee: string = '--All--';
  group: string = 'All';
  selectedDate: Date = new Date();
  dateFormat = "";
  selectedShiftOptionForCell: any =  undefined;
  companies: CompanyModel[] = [];
  selectedCompany: number = 1;
  employees = [];
  selectedEmployee: string;
  groups = [
    { id: 0, value: "All" },
    { id: 1, value: "Non Shift Employee" },
    { id: 2, value: "Shift Employee" },
    { id: 3, value: "Office Boy" },
    { id: 4, value: "Other" },
    { id: 5, value: "Management" },
    { id: 6, value: "IT" },
    
  ];
  cellOptions = [
    { id: 10, value: "O" },
    { id: 15, value: "O" }, { id: 20, value: "OFFDay" },
    { id: 22, value: "PH" }, { id: 2, value: "WO" },
  ]
  selectedGroup: string = null;
  departments: DepartmentModel[];
  departmentTree: any[] = [];
  selectedDepartment: any = undefined;
  selectedDepartments: string[] = [];
  daysInMonth: any[] = [];
  days: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  dutyRoster = [];
  dutyRosterClone = [];
  isLoadingEmployees: boolean = false;
  selectedRows: any[] = [];
  shifts: any[] = [];
  saving: boolean = false;
  UpdatedCells: any[] = [];
  showPopover: boolean = false;

  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private rosterService: DutyRosterService, private worksheetService: WorksheetService) { }

  ngOnInit(): void {
    this.onInitBreadcrumbs()
    this.getCompanies();
    
  }

  onInitBreadcrumbs(): void {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/set-reason', label: 'Duty Roster', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  selectShift(val: string) {
    
  }

  onSelectMonth(date: Date) {
    const selectedMonth = this.selectedMonth.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    this.daysInMonth = [];
    for (let i = 1; i < daysInMonth + 1; i++) {
      date = new Date(year, selectedMonth, i);
      this.daysInMonth.push({ dateObj: date, day: this.days[date.getDay()], dateNumber: i });
    }
    console.log(daysInMonth);
  }

  getShifts(){
    if (this.selectedDepartment != undefined) {
      this.rosterService.getShiftSByDepartment(this.selectedDepartment.data).subscribe(res => {
        this.shifts = res;
      })
    }
    
  }

  getSummery() {
    this.shifts = this.shifts.map(element => {
      element.days = this.daysInMonth;
      return element;
    });
    console.log(this.shifts);
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {;
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = this.baseService.userDetails$.getValue().companyId;
          this.onChangeCompany(this.selectedCompany);
          // this.getEmployees();
          this.onSelectMonth(this.selectedMonth);
        }
      })
  }

  onChangeCompany(compId) {
    this.selectedCompany = compId;
    this.getDepartments();
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
        // this.selectedDepartment = tree[0];
        // this.getEmployees();
      }
    })
  }

  onClickShiftCell(dropDown:any, rowIndex, cellIndex) {
    dropDown.toggle();
  }

  onChangeDepartment(event: TreeNodeSelectEvent) {
    this.getEmployees();
    this.getShifts()
  }

  getEmployees() {
    this.isLoadingEmployees = true
    const userId = this.baseService.userDetails$.getValue().empId;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany, this.selectedDepartment.data.toString(), userId)
      .subscribe(res => {
        this.employees = res
        // this.selectedEmployee = res.length > 0 ? res[0]?.empID : 0;
        this.isLoadingEmployees = false;
      }
      )

    
  }

  onSetSelectedShift(option: any) {
    const { rowData, cellIndex } = this.selectedShiftOptionForCell;
    this.dutyRoster[rowData].days[cellIndex].value = option.value;
  }
  onUpdate() {
    console.log(this.selectedRows);
    this.selectedRows.forEach(element => {
      const index = this.dutyRoster.findIndex(a => a.EmpCD == element.EmpCD);
      if (index > -1) {
        this.dutyRoster[index] = element;
      }
    });
    const month = this.selectedMonth.getMonth() + 1;
    const year = this.selectedMonth.getFullYear();
    localStorage.setItem('dutyRoster-' + year + '-' + month, JSON.stringify(this.dutyRoster));
  }

  // getObjectKey(rowData: any, day: any) {
  //   const keys = Object.keys(rowData);
  //   if(rowData.)
  // }

  // getSummery() {
  //   let arr = [];
  //   this.cellOptions.for
  // }

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

  GetSummery(){
  
  }

  updateRoster() {
    this.saving = true;

    let empIds = this.selectedRows.map(a => a.EmpCD);

    this.UpdatedCells = this.UpdatedCells.filter(a => empIds.includes(a.empId));

    this.rosterService.saveRoster(this.UpdatedCells).subscribe(res => {
      this.alert.success('Roster has been updated successfully');
      this.saving = false;
    }, err => {
      this.alert.error(err);
      this.saving = false;
    });
  }

  onChangeTableDropDown(event: any, index: number, pair: any, rowData: any) {
    event.preventDefault();
    console.log(event);
    this.dutyRoster[index].days[pair.key] = event.value;

    let arrIndex = this.UpdatedCells.findIndex(a => a.empId == rowData.EmpCD && a.date == pair.key);

    if (arrIndex == -1) {
      this.UpdatedCells.push({
        userId: this.baseService.userDetails$.getValue().id,
        empId: rowData.EmpCD,
        shiftId: event.value,
        date: pair.key,
        type: 0,
        rowIndex: index
      })
    } else {
      this.UpdatedCells[arrIndex].shiftId = event.value;
    }
  }
  
  getDutyRoster() {
    const user = this.baseService.userDetails$.getValue();
    const deptId = this.selectedDepartment == null ? "" : this.selectedDepartment?.data?.toString();
    const empId = this.selectedEmployee == null ? "" : this.selectedEmployee;
    this.rosterService.getDutyRoster(this.selectedMonth, this.selectedCompany, deptId,
      empId, true, true, user.customerId).subscribe(data => {
        let rosterData = [];
        this.dutyRoster = data.map(a => {
          let obc: any = {};
          let days: any[] = [];
          Object.keys(a).forEach(key => {
            let dt = new Date(key) as any;
            if (isNaN(dt)) {
              obc[key] = a[key];
            } else {
              days.push({ key: dt.getDate(), value: a[key]})
              // obc['day' + dt.getDate()] = a[key];
            }
          })
          obc.days = days;
          rosterData.push(obc);
        });
        console.log(rosterData);

        this.dutyRoster = rosterData;

        this.onSelectMonth(this.selectedMonth);
    });
  }

}
