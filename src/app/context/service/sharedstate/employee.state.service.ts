import { Injectable } from '@angular/core';
import { EmployeeGridModel } from '../../api/master/employee-grid.model';
import { StateService } from './state.service';
import { EditEmployeeModel } from '../../api/company/edit-employee.model';

const initialState: EmployeeState = {
    employees: [],
    employeeDetails: undefined
};

@Injectable({
    providedIn: 'root'
})
export class EmployeeStateService extends StateService<EmployeeState> {

    employeeList;

    constructor() {
        super(initialState)
    }

    setEmployees(emps: EmployeeGridModel[]) {
        this.setState({ employees: emps });
    }

    getEmployees() {
        return this.state$.asObservable();
    }

    get employees() {
        return this.state.employees;
    }

    setEmployeeDetails(emp: EditEmployeeModel) {
        this.setState({employeeDetails: emp})
    }

    getEmployeeState() {
        return this.state$.asObservable();
    }

    get employeeDetails() {
        return this.state.employeeDetails
    }

}

export class EmployeeState {
    employees: EmployeeGridModel[];
    employeeDetails: EditEmployeeModel;
}