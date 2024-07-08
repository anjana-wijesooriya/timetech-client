import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DynamicDataModel } from './employee.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getMastersData(id: number, filters: any[] = [], isActive: boolean = false) {
    return this.http.post<DynamicDataModel[]>(`${this.apiEndpoint}api/masters?mastersId=` + id + '&isActive=' + isActive, filters);
  }
}

