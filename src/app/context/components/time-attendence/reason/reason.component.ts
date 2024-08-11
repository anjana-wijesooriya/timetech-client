import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { ShiftService } from 'src/app/context/service/shift.service';
import { ICommonActions } from '../../utilities/interfaces/master.interface';
import { DynamicDataModel } from 'src/app/context/service/employee.service';
import { IReason } from 'src/app/context/api/time-attendance/reason.model';
import { CompanyModel } from 'd:/Time Tech V2/timetech-client/src/app/context/api/company/company.model';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Utils } from 'src/app/context/shared/utils';
import { ReasonService } from 'src/app/context/service/reason.service';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrl: './reason.component.scss'
})
export class ReasonComponent implements OnInit, ICommonActions {

  tableEntries: IReason[] = [];
  selectedCompany: CompanyModel;
  companies: CompanyModel[];
  isLoading: boolean = false;
  showAddPanel: boolean = false;
  form = new FormGroup({});
  formOptions: FormlyFormOptions;
  fields: FormlyFieldConfig[] = [];
  model: IReason;
  util: Utils = new Utils();
  links: DynamicDataModel[];

  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private reasonService: ReasonService) { }


  ngOnInit(): void {
    this.onInitBreadcrumbs();
    this.getCompanies();
    this.getPayrollLinks();
    this.onGetTableEntries();
  }

  onInitBreadcrumbs(): void {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/shift', label: 'Reasons', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getPayrollLinks() {
    const compId = this.baseService.userDetails$.getValue().companyId;
    this.sharedService.getMastersData(7, [{ key: 'CompId', value: compId.toString() }], true).subscribe(res => {
      this.links = res.map((a: any) => {
        a['label'] = this.getPayrollLinkLabel(a);
        a['value'] = a['id'];
        return a;
      });
    })
  }

  getPayrollLinkLabel(a: any) {
    switch (a.type) {
      case 1: return a.description + ' - [FA]';
      case 2: return a.description + ' - [VA]';
      case 3: return a.description + ' - [FD]';
      case 4: return a.description + ' - [VD]';
      default: return a.description + ' - ' + a.type;
    }
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = res.find(a => a.compId == this.baseService.userDetails$.getValue().companyId);
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
        }
      })
  }
  onGetTableEntries(): void {
    const compId = this.baseService.userDetails$.getValue().companyId;
    this.sharedService.getMastersData(6, [{ key: 'CompId', value: compId.toString() }], false).subscribe(res => {
      this.tableEntries = res.map((a: IReason) => { return { ...a, color: a.color.substring(0, 7) } }) as IReason[];
    });
  }

  bindForm(item: IReason) {
    this.form.reset();
    if (item == undefined) {
      item = {} as IReason;
      item.reasonName = '';
      item.compId = this.selectedCompany.compId;
      item.createdUser = this.baseService.userDetails$.getValue().empId;
      item.lastUpdatedUser = this.baseService.userDetails$.getValue().empId;
      item.reasonNameArabic = '';
      item.otherCd = 0;
      item.isUpdate = false;
      item.color = '#ffffff';
      item.systemCd = false;
      item.active = true;
      item.deductMissHrs = false;
      item.leaveToBeImportedToPayroll = false;
      item.excuseReason = false;
      item.excuseType = 0;
      item.linkCd = '';
    } else {
      item.isUpdate = true;
    }
    this.model = item;

    this.formOptions = {};
    this.fields = [
      {
        key: 'reasonName',
        type: 'input',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Reason Name',
          placeholder: 'Ex: Sick',
          description: 'Description',
          required: true,
        },
      },
      {
        key: 'reasonNameArabic',
        type: 'input',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Reason Name(Arabic)',
          description: 'Description',
          placeholder: 'Ex: مشاعرة',
          required: true,
        },
        // validators: {
        //   minDate: {
        //     expression: (c: AbstractControl) => !c.value || new Date(c.value) >= new Date(new Date().toDateString()),
        //     message: (error: any, field: FormlyFieldConfig) => `You cannot edit back dated holidays`,
        //   },
        // },
        // props: {
        //   label: 'Date of Holiday',
        //   placeholder: 'Select a Date',
        //   description: 'Description',
        //   dateFormat: 'yy/mm/dd',
        //   hourFormat: '24',
        //   numberOfMonths: 1,
        //   selectionMode: 'single',
        //   defaultDate: new Date(),
        //   required: environment.companyCode == 'ASRY' && this.model.isUpdate,
        //   readonlyInput: false,
        //   showTime: false,
        //   showButtonBar: true,
        //   showIcon: true,
        //   showOtherMonths: true,
        //   selectOtherMonths: false,
        //   monthNavigator: false,
        //   yearNavigator: false,
        //   yearRange: '2020:2030',
        //   inline: false,
        // },
      },
      {
        key: 'otherCode',
        type: 'select',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Payroll Link Code',
          description: 'Description',
          placeholder: 'Select a Option',
          required: false,
          options: this.links
        },
      },
      {
        key: 'color',
        type: 'color',
        className: 'field py-2',
        props: {
          label: 'Choose Color Scheme',
          description: 'Descriotion',
          required: false,
          styleClass: 'flex w-full align-items-center justify-content-between py-2 gap-2',
          class: 'w-5rem'
        },
      },
      {
        key: 'deductMissHrs',
        type: 'switch',
        className: 'field py-2',
        props: {
          label: 'Hours to be missed',
          description: 'Descriotion',
          required: false,
          styleClass: 'flex w-full align-items-center justify-content-between py-2 gap-2',
          class: 'p-inputSwitch-lg'
        },
      },
      {
        key: 'active',
        type: 'switch',
        className: 'field py-2',
        props: {
          label: 'Active',
          description: 'Descriotion',
          required: false,
          styleClass: 'flex w-full align-items-center justify-content-between py-2 gap-2',
          class: 'p-inputSwitch-lg'
        },
      },
      {
        key: 'leaveToBeImportedToPayroll',
        type: 'switch',
        className: 'field py-2',
        props: {
          label: 'Payroll Import',
          description: 'Descriotion',
          required: false,
          styleClass: 'flex w-full align-items-center justify-content-between py-2 gap-2',
          class: 'p-inputSwitch-lg'
        },
      },
      {
        key: 'excuseReason',
        type: 'switch',
        className: 'field py-2',
        props: {
          label: 'Excuse Reason',
          description: 'Descriotion',
          required: false,
          styleClass: 'flex w-full align-items-center justify-content-between py-2 gap-2',
          class: 'p-inputSwitch-lg'
        },
      },
      {
        key: 'excuseType',
        type: 'select',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Payroll Link Code',
          description: 'Description',
          placeholder: 'Select a Option',
          required: false,
          options: this.util.REASON_EXCUSE_TYPES,
        },
        expressions: {
          'props.disabled': 'model.excuseReason != true',
          'props.required': 'model.excuseReason == true',
        }
      },
      {
        key: 'linkCd',
        type: 'input',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Link Code',
          placeholder: 'Ex: SL',
          description: 'Description',

        },

      },
    ];

  }

  getExcuseType(id: number) {
    return (this.util.REASON_EXCUSE_TYPES[id]) ? this.util.REASON_EXCUSE_TYPES[id].label : '';
  }

  onEdit(data: IReason) {
    this.showAddPanel = !this.showAddPanel;
    this.bindForm(data);
  }

  onSubmit(): void {

    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      let entry = this.model as IReason;
      const user = this.baseService.userDetails$.getValue();
      entry.lastUpdatedUser = user.empId;
      entry.compId = user.companyId
      if (this.model.isUpdate) {

      } else {
        entry.createdUser = user.empId;
      }
      entry.isPayrollSpecialImport = entry.leaveToBeImportedToPayroll
      this.reasonService.saveOrUpdate(entry as IReason).subscribe(res => {
        this.alert.success('Record updated successfully.')
        this.onGetTableEntries();
        this.showAddPanel = !this.showAddPanel;
      },
        error => {
          this.alert.error(error)
        })
    }
  }

  deleteConfirm(event: Event, data: IReason) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        this.isLoading = true;
        this.reasonService.delete(data.compId, data.code, 0).subscribe(res => {
          this.alert.success('Record deleted');
          this.onGetTableEntries();
          this.isLoading = false;
        });
      },
      reject: () => {
        this.isLoading = false;
        // this.alert.error('');
      }
    });
  }

  onDelete(): void {
  }
  onUpdate(): void {
  }

}
