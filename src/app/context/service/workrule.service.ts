import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";
import { WorkRuleModel } from "../api/company/employee-support-data.model";

@Injectable({
    providedIn: 'root'
})
export class WorkRuleService extends BaseService {

    baseUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.baseUrl = this.apiEndpoint + 'api/workrules'
    }

    saveOrUpdate(doc: any) {
        return this.http.post<any>(`${this.baseUrl}`, doc);
    }

    assignRuleToDepartment(doc: any) {
        return this.http.post<any>(`${this.baseUrl}/assign-workrule`, doc);
    }

    updateSequence(doc: any) {
        return this.http.patch<any>(`${this.baseUrl}/workrule-template`, doc);
    }

    linkShift(doc: any) {
        return this.http.post<any>(`${this.baseUrl}/link-shift`, doc);
    }

    delete(compId: number, code: number, lastUpdatedId: number) {
        return this.http.delete<any>(`${this.baseUrl}?compId=${compId}&code=${code}&lastUpdatedId=${lastUpdatedId}`);
    }

    deleteShiftTemplate(compId: number, ruleId: number, shiftId: number, day: string) {
        return this.http.delete<any>(`${this.baseUrl}/shift-template?compId=${compId}&ruleid=${ruleId}&shiftId=${shiftId}&day=${day}`);
    }
}