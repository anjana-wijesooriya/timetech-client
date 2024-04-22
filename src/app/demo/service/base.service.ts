import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserPermissionModel } from '../api/user/user-permission.model';
import { LoginResponseModel } from '../api/user/login-response.model';

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
