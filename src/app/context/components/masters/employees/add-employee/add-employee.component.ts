import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { AddEmployeeModel } from 'src/app/context/api/company/add-employee.model';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { EmployeeSupportDataModel, WorkRuleModel, DiscontinuedEmployeeModel } from 'src/app/context/api/company/employee-support-data.model';
import { PairValue } from 'src/app/context/api/dashboard/attendance-details.model';
import { TreeSelectModel } from 'src/app/context/api/shared/tree-select.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { EmployeeSupport } from 'src/app/context/shared/enum/employee-support.enum';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, AfterContentInit {

  companies: CompanyModel[] = [];
  departments: DepartmentModel[] = [];
  departmentTree: TreeSelectModel[] = [];
  selectedDepartment: any;
  selectedCompany: number = 0;
  supportData: EmployeeSupportDataModel = new EmployeeSupportDataModel();
  isDiscontinuedEmployee: boolean;
  workRules: WorkRuleModel[] = [];
  discuntinuedEmployees: DiscontinuedEmployeeModel[] = [];
  validationForm: FormGroup;
  gender: PairValue[] = EmployeeSupport.GENDER;
  public employeeText: string = 'Select a Employee'
  public selectedDisEmployee: any;
  public isSaving: boolean = false;
  isDisableEmployee: boolean;
  arabicRegex: RegExp = /[\u0600-\u06FF]/;
  columns: any[] = [];
  showSlide: boolean = false;
  @Output() loadEmployees: EventEmitter<boolean> = new EventEmitter(false);
  @Output() hideSlide: EventEmitter<boolean> = new EventEmitter(false);
  constructor(private companyService: CompanyService, private baseService: BaseService,
    private employeeService: EmployeeService,
    private fb: FormBuilder, private alert: AlertService) {

  }

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      active: [true, Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      serviceStartDate: ['', Validators.compose([Validators.required])],
      knownAs: ['', Validators.compose([])],
      companyId: [null, Validators.compose([Validators.required, Validators.min(1)])],
      department: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required, Validators.min(1)])],
      nationality: [null, Validators.compose([Validators.required, Validators.min(1)])],
      religion: [null, Validators.compose([Validators.required, Validators.min(1)])],
      workRule: [null, Validators.compose([Validators.required, Validators.min(1)])],
      mobile: ['', Validators.compose([])],
      email: ['', Validators.compose([Validators.email])],
      isDiscontinuedEmployee: [false, Validators.compose([])],
      discontinuedEmployee: [null, Validators.compose([])],
    });
    this.getCompanies();
    this.getEmployeeSupportData();
    this.getWorkRules()
    this.getDiscontinuedEmployees();
    setTimeout(() => {
      this.isDiscontinuedEmployee = false;
      this.isDisableEmployee = true;
    }, 500);
    this.onClear();
  }

  ngAfterContentInit(): void {
    this.validationForm.controls['active'].patchValue(true);
  }


  disEmployeeValidator(AC: AbstractControl) {
    if (this.isDiscontinuedEmployee && (this.selectedDisEmployee != null || this.selectedDisEmployee == undefined)) {
      return { 'empValidator': true };
    }
    return null;
  }

  dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && !(new Date(AC.value.month + '/' + (AC.value.day - 1) + '/' + AC.value.year) < new Date(new Date().toDateString()))) {
      return { 'dateVaidator': true };
    }
    return null;
  }

  departmentValidator(AC: AbstractControl) {
    if (AC && AC.value == null && document.querySelector('.company-select')?.classList.contains('ng-touched')
    ) {
      return { 'departmentValidator': true };
    }
    return null;
  }

  getCompanies() {
    // this.spinner.show();
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res;
          // this.spinner.hide();
        }
      })
  }

  onChangeCompany(event: any) {
    this.validationForm.get('department')?.markAsTouched()
    if (event.value > 0) {
      // this.spinner.show();
      this.companyService.getDepartments(event.value).subscribe({
        next: res => {
          this.departments = res;
          this.departmentTree = this.nest(res, 0);
          this.selectedDepartment = null;
          // this.spinner.hide();
        }
      })
    } else {
      this.departments = [];
      this.departmentTree = []
      this.selectedDepartment = null;
    }

  }

  getEmployeeSupportData() {
    // this.spinner.show();
    this.employeeService.getEmployeeSupportData(true, false, false, true).subscribe(response => {
      this.supportData = response;
      // this.spinner.hide();
    })
  }

  getWorkRules() {
    // this.spinner.show();
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getWorkRules(companyId).subscribe(response => {
      this.workRules = response
      // this.spinner.hide();
    })
  }

  getDiscontinuedEmployees() {
    // this.spinner.show();
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getDiscontinuedEmployee(companyId).subscribe(response => {
      this.discuntinuedEmployees = response;
      // this.isDiscontinuedEmployee = false;
      // this.isDisableEmployee = false;
      // this.spinner.hide();
    })
  }

  onSelectEmployee(item: DiscontinuedEmployeeModel) {
    this.employeeText = `[${item.employeeCode}] ${item.employeeName}`
    this.selectedDisEmployee = item;
  }

  onSelectDepartment($event: TreeNodeSelectEvent) {
    this.selectedDepartment = $event.node as TreeSelectModel;
  }

  isValidForm() {
    const isDisEmpValid = this.isDiscontinuedEmployee ? (this.isDiscontinuedEmployee && this.selectedDisEmployee != null) : true;

    if (!this.validationForm.controls['name'].valid) { this.alert.showError('Employee name is required.') }
    if (!this.validationForm.controls['code'].valid) { this.alert.showError('Employee code is required.') }
    if (!this.validationForm.controls['serviceStartDate'].valid) { this.alert.showError('Service Start Date  is required.') }
    if (!this.validationForm.controls['companyId'].valid) { this.alert.showError('Company is required.') }
    if (this.validationForm.controls['companyId'].valid && !this.validationForm.controls['department'].valid) {
      this.alert.showError('Department is required.')
    }
    if (!this.validationForm.controls['gender'].valid) { this.alert.showError('Gender is required.') }
    if (!this.validationForm.controls['nationality'].valid) { this.alert.showError('Nationality is required.') }
    if (!this.validationForm.controls['religion'].valid) { this.alert.showError('Religion is required.') }
    if (!this.validationForm.controls['workRule'].valid) { this.alert.showError('Work rule is required.') }
    if (!this.validationForm.controls['email'].valid) { this.alert.showError('Email is invalid.') }
    if (!this.validationForm.controls['discontinuedEmployee'].valid) { this.alert.showError('Discontinued Employee is required.') }

    return !this.validationForm.invalid && isDisEmpValid;
  }

  getValue() {
    return this.validationForm.controls['active'].value;
  }

  onSubmit() {
    this.validationForm.markAllAsTouched();
    if (this.validationForm.valid) {
      // this.spinner.show();
      this.isSaving = true;
      let employee: AddEmployeeModel = new AddEmployeeModel();
      employee = this.validationForm.value as AddEmployeeModel;
      employee.departmentId = this.selectedDepartment.key;
      employee.loginUserId = this.baseService.userDetails$.getValue().id;
      employee.serviceStartDate = employee.serviceStartDate;
      if (this.isDiscontinuedEmployee) {
        employee.discontinuedEmployeeId = this.validationForm.controls['discontinuedEmployee'].value;
      }
      console.log(employee)
      this.employeeService.saveEmployee(employee).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.onClear();
          this.alert.success('New Employee Saved.');
          this.loadEmployees.emit(true);
          // this.spinner.hide();
          this.validationForm.reset();
          this.showSlide = false

        }, error: err => {
          this.isSaving = false;
          console.log(err)
          // if(err typeof(String))
          this.alert.error(err);
          // this.spinner.hide();

        }
      })
    }
  }

  onModelChange() {
    if (this.isDiscontinuedEmployee) {
      this.validationForm.get('discontinuedEmployee')?.setValidators([Validators.required]);
      this.isDisableEmployee = false;
      this.validationForm.controls['discontinuedEmployee'].enable();
    } else {
      this.validationForm.get('discontinuedEmployee')?.setValidators([]);
      this.isDisableEmployee = true;
      this.validationForm.controls['discontinuedEmployee'].disable();
    }
    this.validationForm.controls['discontinuedEmployee']?.updateValueAndValidity();
    this.validationForm.controls['discontinuedEmployee']?.markAsTouched();
  }

  onClear() {
    this.selectedDisEmployee = null;
    this.validationForm.reset();

  }

  onHideSlide() {
    // this.hideSlide.emit(true);
  }

  get getMinDate() {
    return { year: 1900, month: 1, day: 1 }
  }

  get getMaxDate() {
    const today = new Date()
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
  }

  renderer = (index: any, label?: string | undefined, value?: string | undefined): string => {
    // let datarecord = this.discuntinuedEmployees[index];
    if (typeof (index) == 'number') {
      let datarecord = this.discuntinuedEmployees[index];
      let table = `<div style="padding: 1px;">
      <div>Employee: [${datarecord.employeeCode}] - ${datarecord.employeeName}</div>
      <div>Department: ${datarecord.departmentName}</div></div>`
      return table;
    }
    return ''

  };

  nest(items: DepartmentModel[], id = 0, link = 'parentDepartmentId') {
    return items
      .filter(element => element.parentDepartmentId === id)
      .map(element => {
        let treeModel: TreeSelectModel = new TreeSelectModel();
        treeModel.key = element.departmentId.toString();
        treeModel.data = element.departmentCode;
        treeModel.label = element.departmentName;
        treeModel.children = this.nest(items, element.departmentId);
        return treeModel;
      });
  }

  companyName(companyId: number) {
    return this.companies.find(a => a.compId == companyId).name;
  }
}
