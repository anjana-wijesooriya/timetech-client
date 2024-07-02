import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AddEmployeeModel } from '../api/company/add-employee.model';
import { DepartmentRightsRequest } from '../api/company/department.model';
import { EditEmployeeModel, IEmployeeBasic, IContact, IDependent, DepatmentRightsModel, DocumentModel, DependentModel, WebLoginModel, ChangePasswordModel } from '../api/company/edit-employee.model';
import { EmployeeSupportDataModel, WorkRuleModel, DiscontinuedEmployeeModel } from '../api/company/employee-support-data.model';
import { EmployeeGridModel } from '../api/master/employee-grid.model';
import { CommonDataModel } from '../api/shared/common-data.model';
import { LeaveType } from '../api/company/leave.model';
import { EmployeeAttachment } from '../api/company/employee-attachment.model';
import { AirTicket, AirTicketDetails, AirTicketHistory, IAirSectorSummery } from '../api/company/air-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService {

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

  getContacts(employeeId: number) {
    return this.http.get<IContact[]>(`${this.employeeUrl}/contacts?employeeId=${employeeId}`);
  }

  getDependents(employeeId: number) {
    return this.http.get<IDependent[]>(`${this.employeeUrl}/dependents?employeeId=${employeeId}`);
  }

  getDocTypes(employeeId: number, isDependent: boolean, isSelfServiceAvailable: boolean = false) {
    return this.http.get<CommonDataModel[]>(`${this.employeeUrl}/doc-types?employeeId=${employeeId}&isDependent=${isDependent}&isAvailableInSelfService=${isSelfServiceAvailable}`);
  }

  getDepartmentRights(customerId: number, companyId: number, employeeId: number) {
    return this.http.get<DepatmentRightsModel[]>(`${this.employeeUrl}/department-rights?customerId=${customerId}&companyId=${companyId}&employeeId=${employeeId}`);
  }

  getDocuments(employeeId: number) {
    return this.http.get<DocumentModel[]>(`${this.employeeUrl}/documents?employeeId=${employeeId}`);
  }

  getLeaveTypes(companyId: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/leaves-types?companyId=${companyId}`);
  }
  saveOrUpdateDocuments(doc: DocumentModel) {
    return this.http.post<DocumentModel[]>(`${this.employeeUrl}/document`, doc);
  }

  deleteDocument(userId: number, docId: number, reason: string) {
    return this.http.delete<any>(`${this.employeeUrl}/document?userId=${userId}&docId=${docId}&reason=${reason}`);
  }

  saveDepartmentRights(requestData: DepartmentRightsRequest) {
    return this.http.post<string>(`${this.employeeUrl}/department-rights`, requestData);
  }

  updateGeneralData(employee: EditEmployeeModel, loggedEmpId: number) {
    return this.http.put<AddEmployeeModel>(`${this.employeeUrl}/general?loggedUserId=${loggedEmpId}`, employee);
  }

  updatePersonalData(employee: EditEmployeeModel, loggedEmpId: number) {
    return this.http.put<AddEmployeeModel>(`${this.employeeUrl}/personal?loggedUserId=${loggedEmpId}`, employee);
  }

  updateTimeAttendanceDetails(employee: EditEmployeeModel, loggedEmpId: number) {
    return this.http.put<string>(`${this.employeeUrl}/time-attendance?loggedUserId=${loggedEmpId}`, employee);
  }

  downloadFile(filePath: string) {
    let data: CommonDataModel = new CommonDataModel();
    data.id = 0;
    data.code = filePath;
    data.name = filePath;
    data.active = true;
    return this.http.post<any>(`${this.employeeUrl}/download-file`, data);
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

  deleteDependent(contactId: number, employeeId: number) {
    return this.http.delete(`${this.employeeUrl}/dependent?contactId=${contactId}&employeeId=${employeeId}`);
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

  getWorkRuleReport(companyId: number, ruleId: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/work-rule-report?companyId=${companyId}&&workruleId=${ruleId}`);
  }

  getDiscontinuedEmployee(companyId: number) {
    return this.http.get<DiscontinuedEmployeeModel[]>(`${this.employeeUrl}/discontinued-employees?companyId=${companyId}`);
  }

  getLeaves(employeeId: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/leave-type?employeeId=${employeeId}`);
  }

  getLeaveBreakup(employeeId: number, leaveType: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/leaves-breakup?employeeId=${employeeId}&leaveType=${leaveType}`);
  }

  getLeaveHistory(employeeId: number, leaveType: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/leaves-history?employeeId=${employeeId}&leaveType=${leaveType}`);
  }

  getLeaveTypeDetails(employeeId: number, leaveType: number) {
    return this.http.get<any>(`${this.employeeUrl}/leaves-type-detail?empId=${employeeId}&leaveType=${leaveType}`);
  }

  saveLeaveType(userId: number, leaveTypeDetails: LeaveType) {
    return this.http.post<any>(`${this.employeeUrl}/leaves-type?userId=${userId}`, leaveTypeDetails);
  }

  deleteLeaveType(employeeId: number, leaveType: number) {
    return this.http.delete<any>(`${this.employeeUrl}/leaves-type?employeeId=${employeeId}&leaveType=${leaveType}`);
  }

  getEmployeeAttachments(employeeId: number) {
    return this.http.get<EmployeeAttachment[]>(`${this.employeeUrl}/attachments?employeeId=${employeeId}`);
  }
  getEmployeeAttachmentTypes(customerId: number) {
    return this.http.get<any[]>(`${this.employeeUrl}/attachment-types?customerId=${customerId}`);
  }
  saveEmployeeAttachment(userId: number, attachment: any) {
    return this.http.post<any>(`${this.employeeUrl}/attachments?userId=${userId}`, attachment);
  }

  deleteEmployeeAttachment(employeeId: number, code: number) {
    return this.http.delete<any>(`${this.employeeUrl}/attachments?employeeId=${employeeId}&code=${code}`);
  }

  getTicketHistory(employeeId: number) {
    return this.http.get<AirTicketHistory[]>(`${this.employeeUrl}/air-ticket-history?employeeId=${employeeId}`);
  }

  getTicketDetails(employeeId: number, ticketId: number, dependentId: number) {
    return this.http.get<AirTicketDetails>(`${this.employeeUrl}/air-ticket-details?employeeId=${employeeId}&ticketId=${ticketId}&dependentId=${dependentId}`);
  }

  getAirTickets(employeeId: number, fromDate: string, companyId: number) {
    return this.http.get<AirTicket[]>(`${this.employeeUrl}/air-tickets?employeeId=${employeeId}&fromDate=${fromDate}&companyId=${companyId}`);
  }

  getAirSectorDetails(employeeId: number) {
    return this.http.get<any>(`${this.employeeUrl}/air-ticket-sector?employeeId=${employeeId}`);
  }

  getAirSectorSummery(employeeId: number, companyId: number, fromDate: string) {
    return this.http.get<IAirSectorSummery>(`${this.employeeUrl}/air-sector-summery?employeeId=${employeeId}&fromDate=${fromDate}&companyId=${companyId}`);
  }

  getMastersData(id: number) {
    return this.http.get<DynamicDataModel[]>(`${this.apiEndpoint}api/masters?mastersId=` + id);
  }
}


export type DynamicDataModel = {
  [id: string]: any
}