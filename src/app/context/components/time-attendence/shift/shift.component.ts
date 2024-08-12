
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { IShift, ShiftModel, ShiftRequestModel } from 'src/app/context/api/time-attendance/shift.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { HolidayService } from 'src/app/context/service/holiday.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { ShiftService } from 'src/app/context/service/shift.service';
import { Utils } from 'src/app/context/shared/utils';
import { DateTime } from "luxon";
import { format } from 'date-fns';
import { DatePipe } from '@angular/common';
import { TabViewChangeEvent } from 'primeng/tabview';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.scss'
})
export class ShiftComponent implements OnInit {
  isLoading: boolean;
  tableEntries: IShift[];
  companies: CompanyModel[];
  selectedCompany: CompanyModel;
  overtimeOptions: any[] = [{ label: 'No OT', value: 0 }, { label: 'OT-1', value: 1 }, { label: 'OT-2', value: 2 }];
  shiftModes: any[] = [];
  formgroup: FormGroup;
  sh: ShiftModel = new ShiftModel();
  mode: string = "list";
  util: Utils = new Utils();
  isSaving: boolean = false;
  disableSeetingConditionFields: boolean = false;

  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private shiftService: ShiftService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.initBreadcrumbs()
    this.getCompanies();
    this.bindForm();
    this.changeMode('list')
  }

  bindForm() {
    this.formgroup = this.fb.nonNullable.group({
      name: new FormControl('', [Validators.required]),
      shiftCode: new FormControl('', [Validators.required]),
      otherCode: new FormControl(''),
      shiftMode: new FormControl(''),
      isRosterShift: new FormControl(false),
      isOteligible: new FormControl(false),
      holiday: new FormControl(false),
      active: new FormControl(true),

    })
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/shift', label: 'Shift', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getShiftModes() {
    const compId = this.selectedCompany.compId;
    this.sharedService.getMastersData(5, [{ key: 'CompId', value: compId.toString() }], false).subscribe(res => {
      this.shiftModes = res;
    })
  }

  onSettingConditions() {
    if (this.sh.shiftSelection == 0) {
      this.sh.firstPunchStart = new Date("1900-01-01T00:00:00");
      this.sh.firstPunchEnd = new Date("1900-01-01T00:00:00");
      this.sh.secondPunchStart = new Date("1900-01-01T00:00:00");
      this.sh.secondPunchEnd = new Date("1900-01-01T00:00:00");
      this.sh.firstPunchNextDay = false;
      this.sh.secondPunchStartNextDay = false;
      this.sh.secondPunchNext = false;

    }
  }

  onSplittingShift() {
    if (this.sh.isSplitShift) {
      this.sh.breakIn = new Date("1900-01-01T00:00:00");
      this.sh.breakOut = new Date("1900-01-01T00:00:00");
      this.sh.breakOt = 0;
      this.sh.breakInnextDay = false;
      this.sh.breakOutNextDay = false;

    }
  }

  saveShift() {
    this.formgroup.markAllAsTouched();
    if (this.formgroup.valid) {
      this.sh = { ...this.sh, ...this.formgroup.value }
      this.isSaving = true;

      const shiftData: ShiftRequestModel = this.sh as ShiftRequestModel;

      for (let key in shiftData) {

        if (this.sh[key] instanceof Date) {
          const old = this.sh[key];
          console.log(this.sh);
          shiftData[key] = shiftData[key].toLocaleTimeString();

          // console.log(key + ' - ' + ' old:' + old + ' | new:' + shiftData[key])
        }
      }
      shiftData.ot3inTime = new Date();
      shiftData.ot3outTime = new Date();
      shiftData.lastUpdateDt = new Date();
      shiftData.createdDt = new Date();

      this.shiftService.saveOrUpdate(shiftData).subscribe(res => {
        this.alert.success('Record updated successfully.')
        this.changeMode('view');
        this.getTableEntries(true);
        this.isSaving = false;
      },
        error => {
          this.alert.error(error);
          this.isSaving = false;
        })
    }

  }



  changeMode(mode: "list" | "view" | "edit") {
    this.mode = mode;
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
          this.getTableEntries();
          this.getShiftModes();
        }
      })
  }

  getTableEntries(isSaved = false) {
    this.isLoading = true;
    var compId = this.selectedCompany.compId
    let filters = [];
    filters.push({ "key": "CompId", "value": compId.toString() });
    filters.push({ "key": "DeptId", "value": "0" });
    this.sharedService.getMastersData(4, filters, false).subscribe(res => {
      this.isLoading = false;
      this.tableEntries = res as any[];

      if (isSaved) {
        this.sh = res.find(a => a['code'] == this.sh.code) as ShiftModel
      } else {
        this.sh = res[1] as ShiftModel;
      }
    })
  }

  onDuplicate() {
    this.mode = 'edit';
    this.sh.code = 0;
    this.bindFormToEdit(this.sh)
  }

  onView(item: ShiftModel) {
    this.mode = 'view';
    this.sh = item as ShiftModel;
    this.bindFormToEdit(this.sh)
  }

  onEdit() {
    this.mode = 'edit';
    this.bindFormToEdit(this.sh);

  }

  addNew() {
    this.mode = 'edit';
    this.sh = new ShiftModel();
    this.bindFormToEdit(this.sh);
  }

  bindFormToEdit(item: ShiftModel) {
    this.formgroup = this.fb.nonNullable.group({
      name: new FormControl(item.name, [Validators.required]),
      shiftCode: new FormControl(item.shiftCode, [Validators.required]),
      otherCode: new FormControl(item.otherCode),
      shiftMode: new FormControl(item.shiftMode),
      isRosterShift: new FormControl(item.isRosterShift),
      isOteligible: new FormControl(item.isOteligible),
      holiday: new FormControl(item.holiday),
      active: new FormControl(item.active),
    });

    for (let key in item) {

      if (typeof item[key] === "string" && (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(item[key]) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(item[key])
        || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/.test(item[key]) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{1}$/.test(item[key]))) {
        item[key] = this.getFromatedDate(new Date(item[key]));
      }
    }

    this.onSettingConditions();
    this.onSplittingShift();


  }

  formatDateTime(date) {
    const hours = this.datepipe.transform(date, 'hh', '+0300', 'en-US');
    const mins = this.datepipe.transform(date, 'mm', '+0300', 'en-US');
    var newdate = new Date().setUTCHours(hours as any);
    newdate = new Date(newdate).setMinutes(mins as any);
    return `1900-01-01T${hours}:${mins}:00.000`;
  }

  formatTime(date: Date) {
    const hours = this.datepipe.transform(date, 'hh', '+0300', 'en-US');
    const mins = this.datepipe.transform(date, 'mm', '+0300', 'en-US');
    return `${hours}:${mins}`;
  }

  getFromatedDate(date: Date) {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    console.log(new Date(new Date(formattedDate).setSeconds(0)));
    return new Date(new Date(formattedDate).setSeconds(0));
  }

  onChangeTab(event: TabViewChangeEvent) {
    switch (event.index) {
      case 4: this.onSplittingShift(); break;
      case 5: this.onSettingConditions(); break;

      default:
        break;
    }
  }

  getDefaultDate(): Date {
    return new Date('1900-01-01 00:00:00');
  }
}
