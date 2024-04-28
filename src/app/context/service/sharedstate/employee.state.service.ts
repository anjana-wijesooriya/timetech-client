import { Injectable } from '@angular/core';
import { EmployeeGridModel } from '../../api/master/employee-grid.model';
import { StateService } from './state.service';

const initialState: EmployeeState = {
    employees: []
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
        this.state$.asObservable();
    }

    get employees() {
        return this.state.employees;
    }

}

export class EmployeeState {
    employees: EmployeeGridModel[];
}