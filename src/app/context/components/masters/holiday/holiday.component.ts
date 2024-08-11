import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { IHoliday } from 'src/app/context/api/master/holiday.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { DynamicDataModel } from 'src/app/context/service/employee.service';
import { HolidayService } from 'src/app/context/service/holiday.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { SupportService } from 'src/app/context/service/support.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent implements OnInit {
  holidays: IHoliday[] = [];
  companies: CompanyModel[] = [];
  years: number[] = [];
  selectedCompany: CompanyModel;
  form = new FormGroup({});
  formOptions: FormlyFormOptions;
  fields: FormlyFieldConfig[] = [];
  dateValue = null

  showAddPanel: boolean = false;
  model: IHoliday;

  isLoading: boolean = false;
  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private holidayService: HolidayService, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService) {

  }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.bindForm(undefined);
    this.getHolidays();
    this.getCompanies()
  }

  bindForm(holiday: IHoliday) {
    this.form.reset();
    if (holiday == undefined) {
      holiday = {} as IHoliday;
      holiday.holiday = new Date();
      holiday.compId = 0;
      holiday.updatedBy = this.baseService.userDetails$.getValue().empId;
      holiday.isCompensationRequiered = false;
      holiday.holidayName = '';
      holiday.isUpdate = false;
    } else {
      holiday.holiday = new Date(holiday.holiday);
      holiday.isUpdate = true;
    }

    this.model = holiday;

    this.formOptions = {};
    this.fields = [
      {
        key: 'holidayName',
        type: 'input',
        className: 'field py-2',
        props: {
          label: 'Holiday Name',
          placeholder: 'Ex: National Labour Day',
          description: 'Description',
          required: true,
        },
      },
      {
        key: 'holiday',
        type: 'datepicker',
        className: 'field py-2',
        defaultValue: new Date(),
        validators: {
          minDate: {
            expression: (c: AbstractControl) => !c.value || new Date(c.value) >= new Date(new Date().toDateString()),
            message: (error: any, field: FormlyFieldConfig) => `You cannot edit back dated holidays`,
          },
        },
        props: {
          label: 'Date of Holiday',
          placeholder: 'Select a Date',
          description: 'Description',
          dateFormat: 'yy/mm/dd',
          hourFormat: '24',
          numberOfMonths: 1,
          selectionMode: 'single',
          defaultDate: new Date(),
          required: environment.companyCode == 'ASRY' && this.model.isUpdate,
          readonlyInput: false,
          showTime: false,
          showButtonBar: true,
          showIcon: true,
          showOtherMonths: true,
          selectOtherMonths: false,
          monthNavigator: false,
          yearNavigator: false,
          yearRange: '2020:2030',
          inline: false,
        },
      },
      {
        key: 'isCompensationRequiered',
        type: 'checkbox',
        className: 'field py-2',
        props: {
          label: 'Compensation Required',
          description: '',
          pattern: 'true',
          required: false,

        },
      }
    ];

  }

  deleteConfirm(event: Event, holiday: IHoliday) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",

      accept: () => {
        this.isLoading = true;
        this.holidayService.deleteHoliday(holiday.compId, holiday.code, this.baseService.userDetails$.getValue().empId).subscribe(res => {
          this.alert.success('Record deleted');
          this.getHolidays();
          this.isLoading = false;
        });
      },
      reject: () => {
        // this.isLoading = false;
        // this.alert.error('');
      }
    });
  }

  submit() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      this.model.compId = this.selectedCompany.compId;
      this.holidayService.saveOrUpdateHoliday(this.model).subscribe(res => {
        this.alert.success('Record updated successfully.')
        this.getHolidays();
        this.showAddPanel = !this.showAddPanel;
      },
        error => {
          this.alert.error(error)
        })
    }
  }

  getHolidays() {
    this.isLoading = true;
    this.sharedService.getMastersData(3, [], false).subscribe(res => {
      this.isLoading = false;
      this.holidays = res as IHoliday[];
      // let tb: Table;
      this.years = [];
      this.holidays.forEach(a => {
        a.year = new Date(a.holiday).getFullYear();
        if (!this.years.includes(a.year)) {
          this.years.push(a.year);
        }
      })

    })
  }

  getDays(date: Date) {
    const days = ['Sunday', 'Monday', "TuesDay", 'WednesDay', 'Thursday', 'Firday', 'Saturday'];

    const day = date.getDay();
    return days[day];
  }



  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/support', label: 'Holidays', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          res
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

  openAddOrEditPanel(holiday: IHoliday = undefined) {
    this.showAddPanel = true;
    this.bindForm(holiday);
  }
}