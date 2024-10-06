import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PairValue } from '../api/dashboard/attendance-details.model';
import { BaseService } from './base.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DutyRosterService extends BaseService {

  dutyRosterUrl: string = "";

  constructor(private http: HttpClient) {
    super();
    this.dutyRosterUrl = this.apiEndpoint + 'api/duty-roster'
  }

  getDutyRoster(date: Date, compId: number, deptId: string, empId: string, empType: boolean, filterType: boolean, custId: number) {
    return this.http.get<any[]>(`${this.dutyRosterUrl}?date=${date.toLocaleDateString()}&compId=${compId}&deptId=${deptId}&empIds=${empId}&empType=${empType}&filterType=${filterType}&custId=${custId}`);
  }

  getShiftSByDepartment(deptId: number) {
    return this.http.get<any[]>(this.dutyRosterUrl + '/shifts?deptId=' + deptId);
  }

  saveRoster(rows: any[]) {
    return this.http.post<any[]>(this.dutyRosterUrl, rows);
  }
  async uploadRoster(date: Date, formData: FormData) {
    return await lastValueFrom(this.http.post<any[]>(`${this.dutyRosterUrl}/import-csv`, formData));

  }

  async uploadRosterFromFIle(userId: any, data: any, month: Date) {
    const url = `${this.dutyRosterUrl}/upload-roster?userId=` + userId + `&date=` + month.toLocaleDateString()
    return await lastValueFrom(this.http.post<any>(url, data));
  }
}
