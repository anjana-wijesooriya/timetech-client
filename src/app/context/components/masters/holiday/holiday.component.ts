import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { IHoliday } from 'src/app/context/api/master/holiday.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { DynamicDataModel } from 'src/app/context/service/employee.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { SupportService } from 'src/app/context/service/support.service';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent implements OnInit {
  holidays: IHoliday[] = [];
  companies: CompanyModel[] = [];
  selectedCompany: number = 1;


  showAddPanel: boolean = false;
  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.getHolidays();
    this.getCompanies()
  }

  getHolidays() {
    this.sharedService.getMastersData(3, [], false).subscribe(res => {
      this.holidays = res as IHoliday[];
      let tb: Table;

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
          // this.selectedComapny = res[0].compId;
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
        }
      })
  }

  onChangeFilters(comId: number, filterId) {

  }
}
