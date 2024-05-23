import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { EditEmployeeModel, IContact } from 'src/app/context/api/company/edit-employee.model';
import { PairValue } from 'src/app/context/api/dashboard/attendance-details.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { EmployeeState, EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { EmployeeSupport } from 'src/app/context/shared/enum/employee-support.enum';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  profiles = [
    { name: 'Admin', code: 'NY', id: '1' },
    { name: 'HR', code: 'RM', id: '1' },
    { name: 'Normal', code: 'LDN', id: '2' }
  ];

  employeeData: EditEmployeeModel = new EditEmployeeModel();

  contactTypes: PairValue[] = EmployeeSupport.CONTACT_TYPES;
  contacts: IContact[] = [];
  loadingContacts: boolean = false;
  value: any
  validationForm: FormGroup;
  contactForm: FormGroup;
  isSaving: boolean = false;
  selectedContact: any = undefined;
  isSavingContact: boolean;
  showContactSlide: boolean = false;

  constructor(private employeeService: EmployeeService, private confirm: ConfirmationService,
    private route: ActivatedRoute, private fb: FormBuilder, private alert: AlertService,
    private baseService: BaseService, private employeeState: EmployeeStateService) { }

  ngOnInit() {
    this.validationForm = this.fb.group({
      emergencyContactName: ["", Validators.compose([Validators.required])],
      emergencyContactRelation: ["", Validators.compose([Validators.required])],
      emergencyContactNo: ["", Validators.compose([Validators.required])],
    });
    // this.contactForm = this.fb.group({
    //   contactType: [null, Validators.compose([Validators.required])],
    //   address: ["", Validators.compose([])],
    //   telephone: ["", Validators.compose([])],
    //   mobileNo: ["", Validators.compose([])],
    //   email: ["", Validators.compose([])],
    //   effectiveDate: ["", Validators.compose([])],
    //   notes: ["", Validators.compose([])],
    // });
    this.getContacts();
    this.employeeState.getEmployeeState().subscribe({
      next: res => {
        if (res?.employeeDetails) {
          this.employeeData = res.employeeDetails;
        }
      }
    })
  }

  getContacts() {
    this.loadingContacts = true;
    const empId = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getContacts(empId).subscribe({
      next: res => {
        this.loadingContacts = false;
        this.contacts = res;
      }
    })
  }

  getDate(date: any) {
    if (date) {
      return new Date(date).toLocaleDateString()
    }
    return '';
  }

  getContactType(type: number) {
    return this.contactTypes.find(a => a.key == type)?.name;
  }

  onSubmit() {
    this.validationForm.markAllAsTouched();
    if (this.validationForm.valid) {
      this.confirm.confirm({
        target: document.body as EventTarget,
        message: 'Do you want to update emergency contact details?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "pi pi-check mr-2",
        rejectIcon: "pi pi-times mr-2",
        acceptButtonStyleClass: "p-button-primary",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this.isSaving = true;
          // this.spinner.show();
          let personalData: EditEmployeeModel = new EditEmployeeModel();
          personalData = this.validationForm.value as EditEmployeeModel;
          personalData.empID = this.employeeData.empID;
          personalData.hasEmergencyContact = true;
          const loggedEmpId = this.baseService.userDetails$.getValue().empId;
          this.employeeService.updatePersonalData(personalData, loggedEmpId).subscribe({
            next: res => {
              this.alert.success('Emergency Contact data updated.');
              // this.spinner.hide();
              this.isSaving = false;
            },
            error: err => {
              this.alert.error(err);
              // this.spinner.hide();
              this.isSaving = false;
            }
          })
        },
        reject: () => {
        }
      });

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
        this.employeeService.deleteContact(contactId, this.employeeData.empID).subscribe({
          next: res => {
            this.contacts = this.contacts.filter(a => a.code != contactId);
            this.alert.success('Contact deleted.');
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

  onSubmitContact() {
    this.contactForm.markAllAsTouched();
    if (!this.contactForm.invalid) {
      this.isSavingContact = true;
      // this.spinner.show();
      let contact = this.contactForm.value as IContact;
      contact.empId = this.employeeData.empID;
      if (this.selectedContact != undefined) {
        contact.code = this.selectedContact.code;
      }
      this.employeeService.saveContact(contact).subscribe({
        next: res => {
          this.getContacts();
          this.alert.success('Contact data updated.');
          // this.spinner.hide();
          this.isSavingContact = false;
          this.selectedContact = undefined;
          // this.modalService.dismissAll();
          this.showContactSlide = false;
        },
        error: err => {
          this.alert.error(err);
          // this.spinner.hide();
          this.isSaving = false;
          this.selectedContact = undefined;
        }
      })
    }
  }

  openAddContactModel(contact: any = undefined) {
    this.selectedContact = contact;
    if (contact == undefined) {
      this.contactForm = this.fb.group({
        contactType: [null, Validators.compose([Validators.required])],
        address: ["", Validators.compose([])],
        telephone: ["", Validators.compose([])],
        mobileNo: ["", Validators.compose([])],
        email: ["", Validators.compose([Validators.email])],
        effectiveDate: [null, Validators.compose([])],
        notes: ["", Validators.compose([])],
      })
    } else {
      this.contactForm = this.fb.group({
        contactType: [contact.contactType, Validators.compose([Validators.required])],
        address: [contact.address, Validators.compose([])],
        telephone: [contact.telephone, Validators.compose([])],
        mobileNo: [contact.mobileNo, Validators.compose([])],
        email: [contact.email, Validators.compose([Validators.email])],
        effectiveDate: [contact.effectiveDate ? new Date(contact.effectiveDate) : null, Validators.compose([])],
        notes: [contact.notes, Validators.compose([])],
      })
    }
  }

}
