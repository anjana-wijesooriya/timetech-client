import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { EditEmployeeModel, WebLoginModel, ChangePasswordModel } from 'src/app/context/api/company/edit-employee.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent implements OnInit {

  employeeData: EditEmployeeModel = new EditEmployeeModel();
  passowrd: string = "";
  confirmPassowrd: string = "";
  isSavingUsername: boolean = false;
  isSavingPassword: boolean = false;
  stateOptions: any[] = [{ label: 'Allowed', value: true }, { label: 'Not Allowed', value: false }];
  @ViewChild('form', { static: false }) form: NgForm;

  constructor(private baseService: BaseService, private employeeService: EmployeeService,
    private alert: AlertService, private confirm: ConfirmationService, private employeeState: EmployeeStateService) { }

  ngOnInit() {
    this.employeeState.getEmployeeState().subscribe(res => {
      if (res?.employeeDetails) {
        this.employeeData = res.employeeDetails;
        setTimeout(() => {
          if (this.employeeData.hasWebLogin) {
            this.form.controls['loginUser']?.setValidators([Validators.required]);
          } else {
            this.form.controls['loginUser']?.setValidators([]);
          }
          this.form.controls['loginUser']?.updateValueAndValidity();
          this.form.controls['loginUser']?.markAsTouched();
        }, 1000);
      }
    })
  }

  onSubmitUsername(form: NgForm) {
    form.form.markAllAsTouched();
    if (form.valid) {
      this.confirm.confirm({
        target: document,
        message: 'Do you want to change the web login details?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "pi pi-check mr-2",
        rejectIcon: "pi pi-times mr-2",
        acceptButtonStyleClass: "p-button-success",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          // this.spinner.show();
          this.isSavingUsername = true;
          const user = this.baseService.userDetails$.getValue();
          let webLogin = new WebLoginModel();
          webLogin.allowWebLogin = form.controls['hasWebLogin'].value;
          webLogin.username = form.controls['loginUser'].value;
          webLogin.loggedUserId = user.id;
          webLogin.companyCode = user.companyCode;
          webLogin.companyId = user.companyId;
          webLogin.employeeId = this.employeeData.empID;
          webLogin.customerId = user.customerId;
          this.employeeService.updateWebLogin(webLogin).subscribe({
            next: res => {
              this.alert.success('Web Login details updated.');
              // this.spinner.hide();
              this.isSavingUsername = false;
            },
            error: err => {
              this.alert.error(err);
              // this.spinner.hide();
              this.isSavingUsername = false;
            }
          })
        },
        reject: () => {
        }
      });
    }
  }

  onSubmitPassword(form: NgForm) {
    form.form.markAllAsTouched();
    form.form.markAsDirty();
    if (form.valid) {
      if ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/).test(this.passowrd)) {
        if (this.passowrd == this.confirmPassowrd) {
          this.confirm.confirm({
            target: document,
            message: 'Do you want to change password of this employee?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "pi pi-check mr-2",
            rejectIcon: "pi pi-times mr-2",
            acceptButtonStyleClass: "p-button-success",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
              // this.spinner.show();
              this.isSavingPassword = true;
              const user = this.baseService.userDetails$.getValue();
              let changePassword = new ChangePasswordModel();
              changePassword.password = this.passowrd;
              changePassword.confirmPassword = this.confirmPassowrd;
              changePassword.loggedUserId = user.id;
              changePassword.companyCode = user.companyCode;
              changePassword.companyId = user.companyId;
              changePassword.employeeId = this.employeeData.empID;
              this.employeeService.changeEmployeePassword(changePassword).subscribe({
                next: res => {
                  this.alert.success('Employee Password has been updated.');
                  // this.spinner.hide();
                  this.isSavingPassword = false;
                },
                error: err => {
                  this.alert.error(err);
                  // this.spinner.hide();
                  this.isSavingPassword = false;
                }
              })
            },
            reject: () => {
            }
          });
        } else {
          this.alert.error('Confirm Password does not match');
        }
      } else {
        this.alert.error('Invalid Password');
      }
    }
  }

  onModelChange(form: NgForm) {
    if (form.controls['hasWebLogin'].value) {
      form.controls['loginUser']?.setValidators([Validators.required]);
    } else {
      form.controls['loginUser']?.setValidators([]);
    }
    form.controls['loginUser']?.updateValueAndValidity();
    form.controls['loginUser']?.markAsTouched();
  }

}
