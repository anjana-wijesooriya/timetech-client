import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { DutyRosterService } from 'src/app/context/service/duty-roster.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { WorksheetService } from 'src/app/context/service/worksheet.service';

@Component({
  selector: 'app-duty-roster-import',
  templateUrl: './duty-roster-import.component.html',
  styleUrl: './duty-roster-import.component.scss'
})
export class DutyRosterImportComponent implements OnInit {


  selectedMonth: any = new Date();
  formgroup: FormGroup = new FormGroup({});
  tableEntries: any[] = [];
  daysInMonth: any[];
  days: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  rosterEntries: any[];
  saving: boolean;

  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private rosterService: DutyRosterService, private worksheetService: WorksheetService, private router: Router ) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      date: new FormControl(new Date(), Validators.required),
      file: new FormControl('', Validators.required)
    })

    this.onInitBreadcrumbs();
  }

  onInitBreadcrumbs(): void {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/set-reason', label: 'Import To Duty Roster', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  get employeeCodes() {
    return Object.keys(this.tableEntries);
  }

  uploadRosterFile() {

    const formData = new FormData();
    const fileControl = this.formgroup.get('file');
    const dateControl = this.formgroup.get('date');

    if (fileControl.value && dateControl.value) {
      formData.append('file', fileControl.value);

      this.rosterService.uploadRoster(this.selectedMonth, formData).then(res => {
        // this.tableEntries = res;
        this.rosterEntries = res;
        this.tableEntries = this.groupBy(res, 'empCode');
        this.onSelectMonth(this.selectedMonth);
      }).catch(err => {
        this.alert.warn(err);
      });
    } else {
      this.alert.warn('Please select both a file and a date.');
    }
  }

  onSaveRoster() {
    let user = this.baseService.userDetails$.getValue();
    this.saving = true;
    this.rosterService.uploadRosterFromFIle(user.id, this.rosterEntries, this.selectedMonth).then(res => {
      this.alert.success('Roster has been saved.');
      this.router.navigate(['/duty-roster', { departmentId: res.message }]);
      this.saving = false;
    }).catch(err => {
      this.alert.error(err);
      this.saving = false;
    });
  }

  onSelectMonth(date: Date) {
    const selectedMonth = this.selectedMonth.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    this.daysInMonth = [];
    for (let i = 1; i < daysInMonth + 1; i++) {
      date = new Date(year, selectedMonth, i);
      this.daysInMonth.push({ dateObj: date, day: this.days[date.getDay()], dateNumber: i });
    }
  }

  onClearTable() { 
    this.tableEntries = [];
    this.rosterEntries = [];
    this.formgroup.reset();
  }
  

  onFileChange(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formgroup.patchValue({
      file: file
    });
    this.formgroup.get('file').updateValueAndValidity();
  }


  groupBy(collection, key) {
    const groupedResult = collection.reduce((previous, current) => {

      if (!previous[current[key]]) {
        previous[current[key]] = []
      }

      previous[current[key]].push(current);
      return previous;
    }, {}); // tried to figure this out, help!!!!!
    return groupedResult
  }




}
