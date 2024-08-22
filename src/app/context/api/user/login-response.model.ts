import { BaseModuleModel } from "../module/base-module.model";

export class LoginResponseModel {
    id: number;
    empId: number;
    companyId: number;
    companyCode: string;
    customerId: number;
    username: string;
    firstName: string;
    token: string;
    isValidLogin: boolean;
    errorMsg: string;
    profileId: number;
    baseModules: BaseModuleModel[];
}