import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";
import { WorkRuleModel } from "../api/company/employee-support-data.model";

@Injectable({
    providedIn: 'root'
})
export class ShiftService extends BaseService {

    baseUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.baseUrl = this.apiEndpoint + 'api/shifts'
    }

    saveOrUpdate(doc: any) {
        return this.http.post<any>(`${this.baseUrl}`, doc);
    }

    delete(compId: number, code: number, lastUpdatedId: number) {
        return this.http.delete<any>(`${this.baseUrl}?compId=${compId}&code=${code}&lastUpdatedId=${lastUpdatedId}`);
    }

    getShiftWorkrule(compId: number, userId: number, isDelete: boolean) {
        return this.http.get<any>(`${this.baseUrl}/shift-workrule?compId=${compId}&loggedUser=${userId}&isDelete=${isDelete}`);
    }
}