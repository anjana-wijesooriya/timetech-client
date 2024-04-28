
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { LoginResponseModel } from '../api/user/login-response.model';
import { LoginModel } from '../api/user/login.model';

@Injectable({providedIn: 'root'})
export class AuthService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }

  login(loginModel: LoginModel) {
    return this.http.post<LoginResponseModel>(this.apiEndpoint + 'api/Auth', loginModel);
  }
  
}