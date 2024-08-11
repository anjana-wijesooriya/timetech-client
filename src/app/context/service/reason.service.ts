import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";
import { WorkRuleModel } from "../api/company/employee-support-data.model";

@Injectable({
    providedIn: 'root'
})
export class ReasonService extends BaseService {
    baseUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.baseUrl = this.apiEndpoint + 'api/reasons'
    }

    saveOrUpdate<T>(doc: T) {
        return this.http.post<T>(`${this.baseUrl}`, doc);
    }

    delete(compId: number, code: number, lastUpdatedId: number = 0) {
        return this.http.delete<any>(`${this.baseUrl}?compId=${compId}&code=${code}&lastUpdatedId=${lastUpdatedId}`);
    }
}