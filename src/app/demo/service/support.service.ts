import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { PairValue } from '../models/dashboard/attendance-details.model';
import { SupportModel } from '../models/master/support.model';
import { SupportDetails } from '../models/master/support-details.model';

@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService   {

  constructor(private http: HttpClient) { 
    super();
  }

  getSupportItems(mode: number = 1){
    return this.http.get<SupportModel[]>(`${this.apiEndpoint}api/support/support-items?mode=${mode}`);
  }

  getSupportDetails(support: SupportModel, customerId: number){
    return this.http.post<SupportDetails[]>(
      `${this.apiEndpoint}api/support/support-details?customerId=${customerId}`, support);
  }

  saveSupportDetails(support: SupportModel){
    return this.http.post<any>(`${this.apiEndpoint}api/support/support-detail`, support);
  }

  updateSupportDetails(support: SupportModel){
    return this.http.patch<any>(`${this.apiEndpoint}api/support/support-detail`, support);
  }
}
