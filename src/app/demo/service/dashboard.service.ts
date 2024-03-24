import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { AttendanceDetailsModel, PairValue } from '../models/dashboard/attendance-details.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor(private http: HttpClient) { 
    super();
  }

  getAttendanceSummery(employeeId: number, fromdate: string, todate: string) {
    return this.http.get<AttendanceDetailsModel>(`${this.apiEndpoint}api/dashboard/attendance-summery?employeeId=${employeeId}
              &fromDate=${fromdate}&toDate=${todate}`);
  }

  getCompanyHolidays(companyId: number){
    return this.http.get<PairValue[]>(`${this.apiEndpoint}api/dashboard/holidays?companyId=${companyId}`);
  }
}
