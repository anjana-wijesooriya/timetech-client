export class EmployeeSupportDataModel {
    religions: SupportDataModel[] = [];
    countries: SupportDataModel[] = [];
    profiles: SupportDataModel[] = [];
    nationalities: SupportDataModel[] = [];
}

export class SupportDataModel {
    cd: number;
    ds: string;
    active: boolean;
}

export class WorkRuleModel {
    companyId: number;
    code: number;
    name: string;
    createdUser: number;
    createdDate: Date;
    lastUpdatedUser: number;
    lastUpdatedDate: Date;
    active: boolean;
    empoyeeId: string;
    empoyeeCode: string;
    isUpdateMode: boolean;
}

export class DiscontinuedEmployeeModel {
    companyId: number;
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    departmentId: number;
    departmentName: string;
    discontinuted: boolean;
    discontinuedDate: Date
}