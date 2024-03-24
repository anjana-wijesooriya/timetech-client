import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { UserPermissionModel } from '../models/user/user-permission.model';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { take, map, firstValueFrom } from 'rxjs';
import { CommonDataModel } from '../models/shared/common-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{

  constructor(private http: HttpClient, private navService: NavigationService,
    private router: Router, private baseService: BaseService) { 
    super();
  }

  getUserProfiles(customerId: number) {
    return this.http.get<CommonDataModel[]>(`${this.apiEndpoint}api/user/profiles?customerId=${customerId}`);
  }

  getUserPermissions(){
    const page = this.router.url;
    const userId = this.baseService.userDetails$.getValue().id;
    return this.http.get<UserPermissionModel>(`${this.apiEndpoint}api/permission?page=${page}&userId=${userId}`)    
  }

  getUserPermissions2(userId: number){
    const page = this.router.url;
    // const userId = this.userDetails$.getValue().id;
    return this.http.get<UserPermissionModel>(`${this.apiEndpoint}api/permission?page=${page}&userId=${userId}`)
      
  }
}
