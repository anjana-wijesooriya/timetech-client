export class AddEmployeeModel {
    id: number;
    code: string;
    name: string;
    knownAs: string;
    active: boolean;
    companyId: number | string;
    departmentId: number | string;
    loginUserId: number;
    mobile: string;
    email: string;
    religion: number;
    gender: number;
    serviceStartDate: any;
    workRule: number;
    blockTrans: boolean = true;
    outputMessege: string;
    isDiscontinuedEmployee: boolean;
    discontinuedEmployeeId: number;
    costCenter: number;
    businessCenter: number;
    financialDepartmentId: number;
    employeeType: number;
    nationality: number;
}