import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DependentModel, IDependent } from 'src/app/context/api/company/edit-employee.model';
import { PairValue } from 'src/app/context/api/dashboard/attendance-details.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { EmployeeSupport } from 'src/app/context/shared/enum/employee-support.enum';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrl: './dependents.component.scss'
})
export class DependentsComponent implements OnInit {

  profiles = [
    { name: 'Admin', code: 'NY', id: '1' },
    { name: 'HR', code: 'RM', id: '1' },
    { name: 'Normal', code: 'LDN', id: '2' }
  ];

  stateOptions: any[] = [
    { label: 'Monthly', value: false },
    { label: 'Yearly', value: true }
  ];

  gender: PairValue[] = EmployeeSupport.GENDER;
  dependentType: PairValue[] = EmployeeSupport.DEPENDENT_TYPES;
  relations: PairValue[] = EmployeeSupport.DEPENDENT_RELATION;
  months: PairValue[] = EmployeeSupport.MONTHS;
  selectedDependent: DependentModel = new DependentModel();
  value: any
  dependents: IDependent[] = [];
  isSaving: boolean = false;
  dependentForm: FormGroup;
  isLoading: boolean = false;
  hasSchoolFees: boolean = false;
  hasAirTickets: boolean = false;
  selectedFeeType: boolean = false;
  employeeId: number = 0;
  relation: string | undefined = undefined;
  @ViewChild('form') form: NgForm;
  showDependentSlide: boolean = false;

  constructor(private employeeService: EmployeeService,
    private route: ActivatedRoute, private fb: FormBuilder, private baseService: BaseService,
    private alert: AlertService, private confirm: ConfirmationService) { }

  ngOnInit() {
    this.getDependents();
  }

  getDependents() {
    const empId = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeId = empId;
    this.isLoading = true;
    this.employeeService.getDependents(empId).subscribe({
      next: res => {
        this.dependents = res;
        this.isLoading = false;
      }
    })
  }

  getDate(date: Date) {
    if (date) {
      return new Date(date).toLocaleDateString()
    }
    return '';
  }

  getGender(type: number) {
    return this.gender.find(a => a.key == type)?.name;
  }

  getDependentType(type: number) {
    return this.dependentType.find(a => a.key == type)?.name;
  }

  onSubmitDependent(form: NgForm) {
    form.form.markAllAsTouched();
    if (form.valid) {
      const loggedUserDetails = this.baseService.userDetails$.getValue();
      this.selectedDependent.loggedUserId = loggedUserDetails.empId;
      this.selectedDependent.companyId = loggedUserDetails.companyId;
      this.selectedDependent.employeeId = this.employeeId;
      // this.spinner.show
      this.isSaving = true;
      this.employeeService.saveDependent(this.selectedDependent).subscribe({
        next: res => {
          if (this.selectedDependent.code == 0) {
            this.alert.success('New Dependent Added.');
          } else {
            this.alert.success('Dependent updated.');
          }
          // this.spinner.hide();
          this.showDependentSlide = false;
          this.isSaving = false;
          this.getDependents();
          // this.modalService.dismissAll();
        },
        error: err => {
          this.alert.error(err);
          // this.spinner.hide();
          this.isSaving = false;
        }
      })
    }
  }

  onDelete(event: Event, contactId: number) {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // this.spinner.show()
        this.employeeService.deleteDependent(contactId, this.employeeId).subscribe({
          next: res => {
            this.dependents = this.dependents.filter(a => a.code != contactId);
            this.alert.success('Dependent deleted.');
            // this.spinner.hide();
          },
          error: err => {
            this.alert.error(err);
            // this.spinner.hide();
          }
        })
      },
      reject: () => {
      }
    });
  }

  openAddDependantModel(dependent: any = undefined) {
    // this.modalService.open(content, { fullscreen: true, size: 'lg', backdrop: 'static', backdropClass: 'model-backdrop' });
    this.showDependentSlide = true;
    this.selectedDependent = new DependentModel();
    if (dependent == undefined) {
      this.selectedDependent.code = 0;
      this.selectedDependent.relation = undefined;
    } else {
      this.selectedDependent = dependent;
      this.selectedDependent.dateBirth = new Date(dependent.dateBirth);
      this.selectedDependent.openingDate = new Date(dependent.openingDate);
      this.selectedDependent.relation = dependent.relation;
    }

  }

  onModelChange(form: NgForm) {
    if (!this.selectedDependent.hasAirTicket) {
      this.selectedDependent.hasOpenTicket = false;
      this.selectedDependent.openingDate = undefined;
      this.selectedDependent.openingTicket = "";
    }
    if (this.selectedDependent.hasOpenTicket) {
      form.controls['selectedDependent'].get('openingTicket')?.setValidators([Validators.required]);
      form.controls['selectedDependent'].get('openingDate')?.setValidators([Validators.required]);
    } else {
      form.controls['selectedDependent'].get('openingTicket')?.setValidators([]);
      form.controls['selectedDependent'].get('openingDate')?.setValidators([]);
      this.selectedDependent.openingDate = undefined;
      this.selectedDependent.openingTicket = "";
    }

    if (this.selectedDependent.isSchoolFee) {
      form.controls['selectedDependent'].get('dateBirth')?.setValidators([Validators.required]);
      form.controls['selectedDependent'].get('monthlyFeeAmount')?.setValidators([Validators.required]);
    } else {
      form.controls['selectedDependent'].get('dateBirth')?.setValidators([]);
      form.controls['selectedDependent'].get('monthlyFeeAmount')?.setValidators([]);
      this.selectedDependent.isBasedOnFeeReceipt = false;
      this.selectedDependent.schoolFeeYearlyPayMonth = undefined;
      this.selectedDependent.monthlyFeeAmount = undefined;
    }
    form.controls['selectedDependent'].get('monthlyFeeAmount')?.updateValueAndValidity();
    form.controls['selectedDependent'].get('monthlyFeeAmount')?.markAsTouched();
    form.controls['selectedDependent'].get('openingTicket')?.updateValueAndValidity();
    form.controls['selectedDependent'].get('openingTicket')?.markAsTouched();
    form.controls['selectedDependent'].get('dateBirth')?.updateValueAndValidity();
    form.controls['selectedDependent'].get('dateBirth')?.markAsTouched();
    form.controls['selectedDependent'].get('openingDate')?.updateValueAndValidity();
    form.controls['selectedDependent'].get('openingDate')?.markAsTouched();
  }

}
