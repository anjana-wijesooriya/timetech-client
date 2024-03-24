import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { EmployeeGridModel } from '../models/master/employee-grid.model';
import { DiscontinuedEmployeeModel, EmployeeSupportDataModel, WorkRuleModel } from '../models/company/employee-support-data.model';
import { AddEmployeeModel } from '../models/company/add-employee.model';
import { ChangePasswordModel, DepatmentRightsModel, DependentModel, DocumentModel, EditEmployeeModel, IContact, IDependent, IEmployeeBasic, WebLoginModel } from '../models/company/edit-employee.model';
import { PairValue } from '../models/dashboard/attendance-details.model';
import { CommonDataModel } from '../models/shared/common-data.model';
import { BehaviorSubject } from 'rxjs';
import { LoginResponseModel } from '../models/user/login-response.model';
import { DepartmentRightsRequest } from '../models/company/department.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService{

  employeeUrl: string = "";
  public employee$ = new BehaviorSubject<EditEmployeeModel>(new EditEmployeeModel());

  constructor(private http: HttpClient) {
    super();
    this.employeeUrl = this.apiEndpoint + 'api/employee'
   }

   public setEmployeeObservable(employee: EditEmployeeModel) {
    this.employee$.next(employee);
  }

  public getEmployeeObservable() {
    return this.employee$.asObservable();
  }

  getEmployees(userId: number, companyId: number) {
    return this.http.get<EmployeeGridModel[]>(`${this.employeeUrl}/?userId=${userId}&companyId=${companyId}`);
  }

  getEmployee(employeeId: number) {
    return this.http.get<EditEmployeeModel>(`${this.employeeUrl}/single?employeeId=${employeeId}`);
  }

  getEmployeeGroups(customerId: number) {
    return this.http.get<CommonDataModel[]>(`${this.employeeUrl}/groups?customerId=${customerId}`);
  }

  getEmployeeReportPersons(customerId: number, companyId: number, includeInActive: boolean = false) {
    return this.http.get<IEmployeeBasic[]>(`${this.employeeUrl}/report-persons?customerId=${customerId}&companyId=${companyId}&includeInActive=${includeInActive}`);
  }

  getResignTypes(customerId: number) {
    return this.http.get<CommonDataModel[]>(`${this.employeeUrl}/resigning-types?customerId=${customerId}`);
  }

  getContacts(employeeId: number){
    return this.http.get<IContact[]>(`${this.employeeUrl}/contacts?employeeId=${employeeId}`);
  }

  getDependents(employeeId: number){
    return this.http.get<IDependent[]>(`${this.employeeUrl}/dependents?employeeId=${employeeId}`);
  }

  getDocTypes(employeeId: number, isDependent: boolean, isSelfServiceAvailable: boolean = false){
    return this.http.get<CommonDataModel[]>(`${this.employeeUrl}/doc-types?employeeId=${employeeId}&isDependent=${isDependent}&isAvailableInSelfService=${isSelfServiceAvailable}`);
  }

  getDepartmentRights(customerId: number, companyId: number, employeeId: number){
    return this.http.get<DepatmentRightsModel[]>(`${this.employeeUrl}/department-rights?customerId=${customerId}&companyId=${companyId}&employeeId=${employeeId}`);
  }

  getDocuments(employeeId: number){
    return this.http.get<DocumentModel[]>(`${this.employeeUrl}/documents?employeeId=${employeeId}`);
  }

  saveOrUpdateDocuments(doc: DocumentModel){
    return this.http.post<DocumentModel[]>(`${this.employeeUrl}/document`,doc);
  }

  deleteDocument(userId: number, docId: number, reason: string){
    return this.http.delete<any>(`${this.employeeUrl}/document?userId=${userId}&docId=${docId}&reason=${reason}`);
  }

  saveDepartmentRights(requestData: DepartmentRightsRequest){
    return this.http.post<string>(`${this.employeeUrl}/department-rights`, requestData);
  }

  updateGeneralData(employee: EditEmployeeModel, loggedEmpId: number) {
    return this.http.put<AddEmployeeModel>(`${this.employeeUrl}/general?loggedUserId=${loggedEmpId}`, employee);
  }

  updatePersonalData(employee: EditEmployeeModel, loggedEmpId: number) {
    return this.http.put<AddEmployeeModel>(`${this.employeeUrl}/personal?loggedUserId=${loggedEmpId}`, employee);
  }

  saveEmployee(employee: AddEmployeeModel) {
    return this.http.post<AddEmployeeModel>(`${this.employeeUrl}`, employee);
  }

  saveContact(contact: IContact) {
    return this.http.post(`${this.employeeUrl}/contact`, contact);
  }

  deleteContact(contactId: number, employeeId: number) {
    return this.http.delete(`${this.employeeUrl}/contact?contactId=${contactId}&employeeId=${employeeId}`);
  }

  saveDependent(contact: DependentModel) {
    return this.http.post(`${this.employeeUrl}/dependent`, contact);
  }

  updateWebLogin(webLogin: WebLoginModel) {
    return this.http.post(`${this.employeeUrl}/web-login`, webLogin);
  }

  changeEmployeePassword(model: ChangePasswordModel) {
    return this.http.post(`${this.employeeUrl}/change-password`, model);
  }

  getEmployeeSupportData(religion: boolean, country: boolean, profile: boolean, nationality: boolean) {
    const endpoint = `support-data?getReligion=${religion}&getCountry=${country}&getProfile=${profile}&getNationality=${nationality}`
    return this.http.get<EmployeeSupportDataModel>(`${this.employeeUrl}/${endpoint}`);
  }

  getWorkRules(companyId: number) {
    return this.http.get<WorkRuleModel[]>(`${this.employeeUrl}/work-rules?companyId=${companyId}`);
  }

  getDiscontinuedEmployee(companyId: number) {
    return this.http.get<DiscontinuedEmployeeModel[]>(`${this.employeeUrl}/discontinued-employees?companyId=${companyId}`);
  }
}
