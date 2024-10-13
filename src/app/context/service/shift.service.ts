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

    SaveShiftWorkrule(compId: number, userId: number, isDelete: boolean, docNo, undo, startDate, endDate, deptIds, empIds, workrule, offDay, muslim, setWorkrule, shift, narration) {
        return this.http.post<any>(`${this.baseUrl}/shift-workrule?compId=${compId}&userId=${userId}&delete=${isDelete}&docNo=${docNo}&undo=${undo}
            &startDate=${startDate}&endDate=${endDate}&deptIds=${deptIds}&empIds=${empIds}&fWR=${workrule}&offDay=${offDay}&muslim=${muslim}&sWR=${setWorkrule}
            &sShift=${shift}&narration=${narration}`, {});
    }

    deleteShiftWorkrule(compId: number, docNo: number, userId: number, isDelete: boolean) {
        return this.http.put<any>(`${this.baseUrl}/shift-workrule?compId=${compId}&docNo=${docNo}&userId=${userId}&delete=${isDelete}`, {});
    }

    rollbackShiftWorkrule(compId: number, docNo: number, userId: number, isDelete: boolean) {
        return this.http.put<any>(`${this.baseUrl}/shift-workrule?compId=${compId}&docNo=${docNo}&userId=${userId}&delete=${isDelete}`, {});
    }

    getShiftWorkruleDetails(compId: number, docId: number) {
        return this.http.get<any>(`${this.baseUrl}/shift-workrule-details?compId=${compId}&docId=${docId}`);
    }
}