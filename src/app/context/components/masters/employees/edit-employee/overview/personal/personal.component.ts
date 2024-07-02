import { HttpEvent, HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UploadEvent } from 'primeng/fileupload';
import { EditEmployeeModel } from 'src/app/context/api/company/edit-employee.model';
import { EmployeeSupportDataModel } from 'src/app/context/api/company/employee-support-data.model';
import { PairValue } from 'src/app/context/api/dashboard/attendance-details.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { EmployeeSupport } from 'src/app/context/shared/enum/employee-support.enum';
import { Utils } from 'src/app/context/shared/utils';

@Component({
  selector: 'app-employee-personal',
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent implements OnInit {

  isSaving: boolean = false;

  set employeeData(value: EditEmployeeModel) {
    this.employee = value
    this.employee.birthDate = new Date(this.employee.dob);
  }
  employee: EditEmployeeModel = new EditEmployeeModel();
  supportData: EmployeeSupportDataModel = new EmployeeSupportDataModel();
  bloodGroups: PairValue[] = EmployeeSupport.BLOOD_GROUPS;
  maritalStatus: PairValue[] = EmployeeSupport.MARITAL_STATUS;
  gender: PairValue[] = EmployeeSupport.GENDER;
  validationForm: FormGroup;
  value: any
  stateOptions: any[] = [{ label: 'Yes', value: true }, { label: 'No', value: false }];


  constructor(private employeeService: EmployeeService, private baseService: BaseService,
    private fb: FormBuilder, private messageService: MessageService, private employeeState: EmployeeStateService,
    private alert: AlertService) { }

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      mobileNo: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      personalEmail: ['', Validators.compose([Validators.email])],
      nationCd: ['', Validators.compose([Validators.required])],
      homeCountryCd: ['', Validators.compose([])],
      birthDate: ['', Validators.compose([])],
      birthDs: ['', Validators.compose([])],
      relgCd: ['', Validators.compose([Validators.required])],
      bloodGroup: ['', Validators.compose([])],
      maritalStatusCd: ['', Validators.compose([])],
      sex: ['', Validators.compose([Validators.required])],
      isVisitorsAllowed: ['', Validators.compose([])],
      hasCompanyAccommodation: ['', Validators.compose([])],
      roomNo: ['', Validators.compose([])],
      building: ['', Validators.compose([])],
      road: ['', Validators.compose([])],
      block: ['', Validators.compose([])],
      area: ['', Validators.compose([])],
    });
    this.employeeState.getEmployeeState().subscribe(res => {
      if (res?.employeeDetails) {
        this.employeeData = res.employeeDetails;
      }
    })
    this.getEmpSupportData();
  }

  getEmpSupportData() {
    this.employeeService.getEmployeeSupportData(true, true, false, true).subscribe({
      next: res => {
        this.supportData = res;
      }
    })
  }

  onUploadImage(event: UploadEvent) {
    console.log(event)
    let response = event.originalEvent as any;
    if (response?.body?.success && response?.body?.url != '') {
      this.employee.imagePath = '';
      this.employee.imagePath = new Utils().getImageBlobUrl(response?.body?.url);
      let empState = this.employeeState.employeeDetails;
      empState.imagePath = this.employee.imagePath;
      this.employeeState.setEmployeeDetails(empState);
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile picture updated.' });
  }

  onBeforeUpload(event: UploadEvent) {
    this.employee.imagePath = 'spinner'
    let empState = this.employeeState.employeeDetails;
    empState.imagePath = this.employee.imagePath;
    this.employeeState.setEmployeeDetails(empState);
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File ' });
  }

  onSubmit() {
    this.validationForm.markAllAsTouched();
    if (!this.validationForm.invalid) {
      // this.spinner.show();
      this.isSaving = true;
      let personalData: EditEmployeeModel = new EditEmployeeModel();
      personalData = this.validationForm.value as EditEmployeeModel;
      personalData.empID = this.employee.empID;
      const loggedEmpId = this.baseService.userDetails$.getValue().empId;
      this.employeeService.updatePersonalData(personalData, loggedEmpId).subscribe({
        next: res => {
          this.alert.success('Employee Personal data updated.');
          // this.spinner.hide();
          this.isSaving = false;
        },
        error: err => {
          this.alert.error(err);
          // this.spinner.hide();
          this.isSaving = false;
        }
      })
    }
  }

}