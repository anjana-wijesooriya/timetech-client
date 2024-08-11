import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";
import { WorkRuleModel } from "../api/company/employee-support-data.model";
import { IWorksheet } from "../api/time-attendance/worksheet.model";

@Injectable({
    providedIn: 'root'
})
export class WorksheetService extends BaseService {

    baseUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.baseUrl = this.apiEndpoint + 'api/Worksheets'
    }

    getWorksheets(compId: number, rCode: number, userId: number, body: any) {
        return this.http.post<IWorksheet[]>(`${this.baseUrl}?compId=${compId}&reasonCode=${rCode}&loginUser=${userId}`, body);
    }

    getEmployeesByDepartment(compId: number, deptIds: string, userId: number) {
        return this.http.get<any[]>(`${this.baseUrl}/employees?compId=${compId}&deptIds=${deptIds}&loginUser=${userId}`);
    }

    processData(compId: number, deptIds: string, empIds: string, userId: number, from: string, to: string) {
        return this.http.get<any[]>(`${this.baseUrl}/process-data?compId=${compId}&deptIds=${deptIds}&loginUser=${userId}&empIds=${empIds}&logginUserId=${userId}&from=${from}&to=${to}`);
    }
}