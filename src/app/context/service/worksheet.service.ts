import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";
import { WorkRuleModel } from "../api/company/employee-support-data.model";
import { IWorksheet, IWorksheetModel } from "../api/time-attendance/worksheet.model";

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
        return this.http.post<IWorksheetModel[]>(`${this.baseUrl}?compId=${compId}&reasonCode=${rCode}&loginUser=${userId}`, body);
    }

    getEmployeesByDepartment(compId: number, deptIds: string, userId: number) {
        return this.http.get<any[]>(`${this.baseUrl}/employees?compId=${compId}&deptIds=${deptIds}&loginUser=${userId}`);
    }

    processData(compId: number, deptIds: string, empIds: string, userId: number, from: string, to: string) {
        return this.http.get<any[]>(`${this.baseUrl}/process-data?compId=${compId}&deptIds=${deptIds}&loginUser=${userId}&empIds=${empIds}&logginUserId=${userId}&from=${from}&to=${to}`);
    }

    getAttendanceData(compId: number, empId: number, shiftId: number, date: string) {
        return this.http.get<any>(`${this.baseUrl}/get-attendance-data?compId=${compId}&empId=${empId}&shiftId=${shiftId}&date=${date}`);
    }

    saveAttendanceData(compId: number, userId: number, profileId: number, data: any) {
        return this.http.post<any>(`${this.baseUrl}/save-attendance?compId=${compId}&profileId=${profileId}&loginUser=${userId}`, data);
    }

    addPunch(compId: number, userId: number, data: any) {
        return this.http.post<any>(`${this.baseUrl}/add-punch?compId=${compId}&userId=${userId}`, data);
    }

    calculateAttendance(compId: number, userId: number, profileId: number, data: any) {
        return this.http.post<any>(`${this.baseUrl}/calculate?compId=${compId}&profileId=${profileId}&loginUser=${userId}`, data);
    }

    totalExcuseTime(empId: number, date: string) {
        return this.http.get<any>(`${this.baseUrl}/total-excuse-time?empId=${empId}&date=${date}`);
    }

    setLeave(data: any) {
        return this.http.post<any>(`${this.baseUrl}/set-leave`, data);
    }

    changeShift(data: any) {
        return this.http.post<any>(`${this.baseUrl}/change-shift`, data);
    }

    deletePunch(compId: number, userId: number, data: any) {
        return this.http.post<any>(`${this.baseUrl}/delete-punch?compId=${compId}&userId=${userId}`, data);
    }

    reset(empId: number, userId: number, date: string) {
        return this.http.get<any>(`${this.baseUrl}/reset?empId=${empId}&userId=${userId}&date=${date}`);
    }
}