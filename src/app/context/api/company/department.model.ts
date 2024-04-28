import { DepatmentRightsModel } from "./edit-employee.model";

export class DepartmentModel {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    parentDepartmentId: number;
}

export class DepartmentRightsRequest {
    departments: DepatmentRightsModel[];
    employeeId: number;
    companyId: number;
    loggedUserId: number;
}