import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from "@angular/core";
import { IHoliday } from "../api/master/holiday.model";

@Injectable({
    providedIn: 'root'
})
export class HolidayService extends BaseService {

    holidayUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.holidayUrl = this.apiEndpoint + 'api/holidays'
    }

    saveOrUpdateHoliday(doc: IHoliday) {
        return this.http.post<any>(`${this.holidayUrl}`, doc);
    }

    deleteHoliday(compId: number, code: number, lastUpdatedId: number) {
        return this.http.delete<any>(`${this.holidayUrl}?compId=${compId}&code=${code}&lastUpdatedId=${lastUpdatedId}`);
    }
}