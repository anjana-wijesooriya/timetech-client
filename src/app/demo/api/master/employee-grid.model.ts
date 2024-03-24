import { PairValue } from "../dashboard/attendance-details.model";

export class EmployeeGridModel   {
    empId: number;
    empCd: string;
    empName: string;
    empShName: string;
    email: string;
    deptCd: string;
    deptDs: string;
    active: string;
    isActive: boolean;
    cardNo: string;
    workrule: number;
    enrollID: number;
    showEmail: boolean;
    designation: string;
    designationObj: PairValue;
    userProfile: string;
    userProfileObj: PairValue;
    joinDateS: string;
    nationalID: string;
  }