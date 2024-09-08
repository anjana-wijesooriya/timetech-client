import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";


@Injectable({
    providedIn: 'root'
})
export class SetReasonService extends BaseService {

    baseUrl: string = "";

    constructor(private http: HttpClient) {
        super();
        this.baseUrl = this.apiEndpoint + 'api/set-reasons'
    }

    getSetReasons(compId: number, empCd: string = "") {
        return this.http.get<any[]>(`${this.baseUrl}?compId=${compId}&empCd=${empCd}`);
    }

    saveOrUpdate(data: any) {
        return this.http.post<any[]>(`${this.baseUrl}`, data);
    }
}