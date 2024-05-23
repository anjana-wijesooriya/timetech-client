import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ListboxClickEvent } from 'primeng/listbox';
import { SupportDetails } from 'src/app/context/api/master/support-details.model';
import { SupportModel } from 'src/app/context/api/master/support.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { SupportService } from 'src/app/context/service/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {

  selectedField!: number;
  showFieldOptionsSlide: boolean = false;
  supportFields: SupportModel[] = [];
  supportFieldOptions: SupportDetails[] = [];
  selectedDetails: SupportDetails = new SupportDetails();
  selectedSupportModel: SupportModel = new SupportModel();
  validationForm: FormGroup;
  isEditMode: boolean = false;
  // get name(): AbstractControl { return this.validationForm.get('name')!; }
  // get otherCode(): AbstractControl { return this.validationForm.get('otherCode')!; }
  // get sequence(): AbstractControl { return this.validationForm.get('sequence')!; }
  isSaving: boolean = false;
  // @ViewChild('form', { static: false }) form: NgForm;

  constructor(private breadcrumbState: BreadcrumbStateService, private supportService: SupportService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService

  ) { }


  ngOnInit(): void {
    this.initBreadcrumbs()
    this.getSupportItems();
    this.validationForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      otherCode: [null, Validators.compose([Validators.required])],
      sequence: [0, Validators.compose([])],
      active: [true, Validators.compose([])],
    });
  }


  getSupportItems() {
    this.supportService.getSupportItems().subscribe(response => {
      this.supportFields = response;
      this.selectedField = response[3].code;
      this.onChangeSupportField(response[3]);
    })
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/support', label: 'Support Data Fields', key: '2', icon: ' text-bold ic i-Support' },
    ]);
  }

  onSubmit() {
    this.validationForm.markAllAsTouched();
    if (!this.validationForm.invalid) {
      let supportData = this.validationForm.value;
      supportData.sequence = supportData.sequence == null || supportData.sequence == '' ? 0 : supportData.sequence;
      const supportField = this.supportFields.find(x => x.code == this.selectedField);
      supportData.tableName = supportField.tableName;
      supportData.FieldIdName = supportField.fieldCode;
      supportData.FieldCodeName = supportField.fieldName;
      supportData.FieldOtherCodeName = supportField.fieldOtherCode;
      let user = this.baseService.userDetails$.getValue();
      supportData.CustomerId = user.customerId;
      supportData.LoggedUserId = user.empId;
      if (this.isEditMode) {
        supportData.code = this.selectedDetails.code;
        this.supportService.updateSupportDetails(supportData).subscribe({
          next: (response) => {
            this.alert.success('Record updated.');
            this.supportFieldOptions = response;
            this.showFieldOptionsSlide = false
          },
          error: (e) => {
            this.alert.error(e.error.description);
            console.error(e)
          },
          complete: () => console.info('Updated')
        });
      } else {
        this.supportService.saveSupportDetails(supportData).subscribe({
          next: (response) => {
            this.alert.success('Record saved.');
            this.supportFieldOptions = response;
            this.showFieldOptionsSlide = false
          },
          error: (e) => {
            this.alert.error(e.error.description);
            console.error(e)
          },
          complete: () => console.info('Saved')
        });
      }
    }
  }

  onChangeSupportField(supportItem: SupportModel) {
    const customerId = this.baseService.userDetails$.getValue().empId;
    this.supportService.getSupportDetails(supportItem, customerId).subscribe(response => {
      this.supportFieldOptions = response;
    });
  }

  openFieldOptionSlide(details: SupportDetails = undefined, form: NgForm) {
    this.showFieldOptionsSlide = true;
    this.validationForm.reset()
    this.selectedDetails = new SupportDetails();
    if (details != undefined) {
      this.selectedDetails = details;
      this.isEditMode = true;
    } else {
      this.selectedDetails.active = true;
      this.isEditMode = false;
    }
  }

  onCancel() {
    this.showFieldOptionsSlide = false;
    this.selectedDetails = new SupportDetails();
    this.validationForm.reset();
  }

  onClickSupportField(event: ListboxClickEvent) {
    let user = this.baseService.userDetails$.getValue();
    this.supportService.getSupportDetails(event.option as SupportModel, user.customerId).subscribe(response => {
      this.supportFieldOptions = response;
    })
  }
}
