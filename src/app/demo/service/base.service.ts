import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../models/user/login-response.model';
import { UserPermissionModel } from '../models/user/user-permission.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  apiEndpoint = 'https://localhost:44319/';
  // public userDetails: LoginResponseModel;
  pagePermission: UserPermissionModel;

  public userDetails$ = new BehaviorSubject<LoginResponseModel>(new LoginResponseModel());

  constructor() { 
  }

  public setLoginDetails(user: LoginResponseModel) {
    this.userDetails$.next(user);
  }

  public getUser() {
    return this.userDetails$.asObservable();
  }
}
