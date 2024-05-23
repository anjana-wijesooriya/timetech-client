import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService, MenuItem } from 'primeng/api';
import { EditEmployeeModel, IEmployeeBasic } from 'src/app/context/api/company/edit-employee.model';
import { CommonDataModel } from 'src/app/context/api/shared/common-data.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { UserService } from 'src/app/context/service/user.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  animations: [

  ]
})
export class GeneralComponent implements OnInit {

  set employeeData(value: EditEmployeeModel) {
    this.employee = value;
    this.employee.joinDate = this.employee?.joinDt ? new Date(this.employee.joinDt) : null;
    this.employee.serviceStartDate = this.employee?.serviceStartDt ? new Date(this.employee.serviceStartDt) : null;
    this.employee.discontinuedDate = this.employee?.discontinuedDt ? new Date(this.employee.discontinuedDt) : null;
    this.employee.resignationDt = this.employee?.resignationDate ? new Date(this.employee.resignationDate) : null;
    this.employee.userProfile = this.getDefaultValue(this.employee.userProfile);
    this.employee.reportTo = this.getDefaultValue(this.employee.reportTo);
    this.employee.grpCd = this.getDefaultValue(this.employee.grpCd);
    this.employee.locationCd = this.getDefaultValue(this.employee.locationCd);
    this.employee.discontinuedReasonId = this.getDefaultValue(this.employee.discontinuedReasonId);
    this.employee.homeCountryCd = this.getDefaultValue(this.employee.homeCountryCd);
    this.employee.nationCd = this.getDefaultValue(this.employee.nationCd);
    this.employee.relgCd = this.getDefaultValue(this.employee.relgCd);
    this.employee.maritalStatusCd = this.getDefaultValue(this.employee.maritalStatusCd);
    this.employee.sex = this.getDefaultValue(this.employee.sex);
    this.emp = value;
  };

  get employeeData() { return this.emp; }
  employee: EditEmployeeModel = new EditEmployeeModel();
  emp: EditEmployeeModel = new EditEmployeeModel();
  // value: any;
  validationForm: FormGroup;
  userProfiles: CommonDataModel[];
  employeeGroups: CommonDataModel[] = [];
  reportPersons: IEmployeeBasic[] = [];
  locations: CommonDataModel[] = [];
  resignTypes: CommonDataModel[] = [];

  menuItems: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  stateOptions: any[] = [{ label: 'Active', value: true }, { label: 'Inactive', value: false }];
  date: Date = new Date();
  value: string = 'off';
  activeStep: number | undefined = 0;

  profiles = [
    { name: 'Admin', code: 'NY', id: '1' },
    { name: 'HR', code: 'RM', id: '1' },
    { name: 'Normal', code: 'LDN', id: '2' }
  ];

  items = [
    {
      label: 'Finder',
      icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg'
    },
    {
      label: 'App Store',
      icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg'
    },
    {
      label: 'Photos',
      icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg'
    },
    {
      label: 'Trash',
      icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
    }
  ];
  rpersons: any[];
  isSaving: boolean;
  arabicRegex: RegExp = /[\u0600-\u06FF]/;

  @ViewChild('form') form: NgForm;

  constructor(private baseService: BaseService, private employeeService: EmployeeService,
    private employeeState: EmployeeStateService, private alert: AlertService,
    private userService: UserService, private companyService: CompanyService,
    public router: Router, public route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.employeeData = new EditEmployeeModel();
    // this.validationForm = this.fb.group({
    //   empName: [null, Validators.compose([Validators.required])],
    // empArabicName: ['', Validators.compose([])],
    // empCd: [null, Validators.compose([Validators.required])],
    // empShName: [null, Validators.compose([])],
    // empArabicShName: [null, Validators.compose([])],
    // active: [true, Validators.compose([])],
    // joinDate: [null, Validators.compose([])],
    // serviceStartDate: [null, Validators.compose([Validators.required])],
    // userProfile: [null, Validators.compose([Validators.required])],
    // grpCd: [null, Validators.compose([])],
    // reportTo: [null, Validators.compose([])],
    // locationCd: [null, Validators.compose([])],
    // cpr: [null, Validators.compose([])],
    // license: [null, Validators.compose([])],
    // resignationDt: [null, Validators.compose([])],
    // discontinuedDate: [null, Validators.compose([])],
    // discontinuedReasonId: [null, Validators.compose([])],
    // discontinuedReason: [null, Validators.compose([])],
    // discontinued: [null, Validators.compose([])],
    // });

    this.getEmployeeGroups();
    this.getReportPersons();
    this.getLocations();
    this.getResignTypes();
    this.getUserProfiles()
    this.employeeState.getEmployeeState()
      .subscribe(res => {
        // debugger;
        if (res?.employeeDetails) {
          this.employeeData = res.employeeDetails;
        }
      })
  }

  discontinuedDateValidator(AC: AbstractControl) {
    if (this.employee.discontinued && (this.employee.discontinuedDate != null || this.employee.discontinuedDate == undefined)) {
      return { 'empValidator': true };
    }
    return null;
  }

  getUserProfiles() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.userService.getUserProfiles(customerId).subscribe({
      next: (res) => {
        this.userProfiles = res;
        // this.spinner.hide();
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  getReportPersonText(id: number | null | undefined) {
    if (id != null) {
      const person = this.reportPersons.find(a => a.id);
      return `[${person?.id}] ${person?.name}`;
    }
    return null;
  }

  getEmployeeGroups() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.employeeService.getEmployeeGroups(customerId).subscribe({
      next: (res) => {
        this.employeeGroups = res;
        // this.spinner.hide();
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  getReportPersons() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getEmployeeReportPersons(customerId, companyId).subscribe({
      next: (res) => {
        this.reportPersons = res;
        this.rpersons = res.sort((a, b) => a.company.localeCompare(b.company))
          .sort((a, b) => a.name.localeCompare(b.name));
        // this.spinner.hide();
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  getLocations() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.companyService.getLocations(customerId).subscribe({
      next: (res) => {
        this.locations = res;
        // this.spinner.hide();
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  getResignTypes() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.employeeService.getResignTypes(customerId).subscribe({
      next: (res) => {
        this.resignTypes = res;
        // this.spinner.hide();
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  onSubmit(form: NgForm) {
    form.form.markAllAsTouched();
    if (this.isValidForm(form)) {
      // this.spinner.show();
      this.isSaving = true;
      let generalData: EditEmployeeModel = new EditEmployeeModel();
      generalData = form.form.value as EditEmployeeModel;
      generalData.empID = this.employee.empID;
      const loggedEmpId = this.baseService.userDetails$.getValue().empId;
      this.employeeService.updateGeneralData(generalData, loggedEmpId).subscribe({
        next: res => {
          this.alert.success('Employee General data updated.');
          // this.spinner.hide();
          // this.employeeState.setEmployeeDetails(generalData);
          this.isSaving = false;
        },
        error: err => {
          this.alert.error(err.error);
          // this.spinner.hide();
          this.isSaving = false;
        }
      })
    }
  }

  isValidForm(form: NgForm) {
    const isNumbersOnly = this.baseService.userDetails$.getValue().companyCode == 'IBN'
    // let isValidEmpCode: boolean = true;
    if (isNumbersOnly) {
      if (!(/^\d+$/).test(this.employee.empCd)) {
        this.alert.error('Employee code should have numbers only');
        return false;
      }
    }
    return !form.form.invalid
  }

  nest(items: IEmployeeBasic[]) {

    const companies = Object.keys(this.groupBy(items, 'company'))
    return companies.map(a => {
      return {
        id: a,
        label: a,
        items: items.filter(b => b.company == a)
          .sort((a, b) => a.name.localeCompare(b.name))
          .sort((a, b) => a.department.localeCompare(b.department))
      }
    });
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


  getDefaultValue(value: number | null | undefined) {
    return value == 0 ? undefined : value;
  }

  onModelChange(form: NgForm) {
    if (this.employee.discontinued == true) {
      form.control.get('discontinuedReason')?.setValidators([Validators.required]);
      form.control.get('discontinuedDate')?.setValidators([Validators.required]);
    } else {
      form.control.get('discontinuedReason')?.clearValidators();
      form.control.get('discontinuedDate')?.clearValidators();
    }
    form.control.get('discontinuedReason')?.updateValueAndValidity();
    form.control.get('discontinuedDate')?.updateValueAndValidity();
    form.control.get('discontinuedReason')?.markAsTouched();
    form.control.get('discontinuedDate')?.markAsTouched();
  }
}