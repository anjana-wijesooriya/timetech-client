import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ModuleModel } from '../api/module/module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends BaseService {

  private $activeModules = new BehaviorSubject<ModuleModel[]>([]);

  constructor(private http: HttpClient) {
    super();
  }

  getModules(userId: number, baseModuleId: number, lang: string) {
    const endpoint = `api/module/modules?userId=${userId}&baseModuleId=${baseModuleId}&lang=en`;
    return this.http.get<ModuleModel[]>(`${this.apiEndpoint}${endpoint}`);
  }

  public setActiveModules(modules: ModuleModel[]) {
    this.$activeModules.next(modules);
  }

  public getActiveModules() {
    return this.$activeModules.asObservable();
  }

}
