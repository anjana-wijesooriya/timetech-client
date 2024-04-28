import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CompanyModel } from '../api/company/company.model';
import { DepartmentModel } from '../api/company/department.model';
import { CommonDataModel } from '../api/shared/common-data.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {

  companyApi: string = ''

  constructor(private http: HttpClient) {
    super();
    this.companyApi = this.apiEndpoint + 'api/company'
  }



  getCompanies(customerId: number) {
    return this.http.get<CompanyModel[]>(`${this.companyApi}?customerId=${customerId}`);
  }

  getDepartments(companyId: number) {
    return this.http.get<DepartmentModel[]>(`${this.companyApi}/departments?companyId=${companyId}`);
  }

  getLocations(customerId: number) {
    return this.http.get<CommonDataModel[]>(`${this.companyApi}/locations?customerId=${customerId}`);
  }
}
