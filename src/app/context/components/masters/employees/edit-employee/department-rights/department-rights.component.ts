import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode, ConfirmationService } from 'primeng/api';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { DepartmentRightsRequest } from 'src/app/context/api/company/department.model';
import { DepatmentRightsModel } from 'src/app/context/api/company/edit-employee.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-department-rights',
  templateUrl: './department-rights.component.html',
  styleUrl: './department-rights.component.scss'
})
export class DepartmentRightsComponent implements OnInit {
  companies: CompanyModel[] = [];
  selectedComapny: number;
  departments: DepatmentRightsModel[];
  departmentTree: TreeNode[];
  cols!: Column[];
  selectedNodes: any
  isActiveAll: any;
  isSaving: boolean;

  constructor(private companyService: CompanyService, private baseService: BaseService, private alert: AlertService,
    private employeeService: EmployeeService, private route: ActivatedRoute, private confirm: ConfirmationService) { }

  ngOnInit(): void {
    this.getCompanies();
    this.cols = [
      { field: 'type', header: 'Depatment Code' },
      { field: 'name', header: 'Department Name' }
    ];
  }

  getCompanies() {
    // this.spinner.show();
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res;
          this.selectedComapny = res[0].compId;
          this.onChangeCompany(this.selectedComapny);
          // this.spinner.hide();
        }
      })
  }

  onChangeCompany(event: any) {
    if (event > 0) {
      // this.spinner.show();
      const user = this.baseService.userDetails$.getValue();
      const empId = Number(this.route.snapshot?.parent?.paramMap.get('id'));
      this.employeeService.getDepartmentRights(user.customerId, user.companyId, empId).subscribe({
        next: res => {
          this.departments = res;
          const children = this.nest(res, 0);
          let root: TreeNode = {
            children: this.nest(res, 0),
            data: this.selectedComapny,
            label: 'Timetech'
          }
          this.departmentTree = this.nest(res, 0);
          // this.spinner.hide();
        }
      })
    } else {
      this.departments = [];
      this.departmentTree = []
    }
  }

  onUpdateRights() {
    this.confirm.confirm({
      target: document,
      message: 'Do you want to chnange the department rights of this employee?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",
      acceptButtonStyleClass: "p-button-success",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // this.spinner.show();
        this.isSaving = true;
        const user = this.baseService.userDetails$.getValue();
        let request: DepartmentRightsRequest = {
          departments: this.departments.filter(a => a.active),
          companyId: user.companyId,
          employeeId: Number(this.route.snapshot?.parent?.paramMap.get('id')),
          loggedUserId: user.id,
        }
        this.employeeService.saveDepartmentRights(request).subscribe({
          next: res => {
            this.alert.success('Employee department rights updated.');
            // this.spinner.hide();
            this.isSaving = false;
          },
          error: err => {
            this.alert.error(err);
            // this.spinner.hide();
            this.isSaving = false;
          }
        })
      },
      reject: () => {
      }
    });
  }

  onChangeToggler(event: CheckboxChangeEvent) {
    this.departments = this.departments.map(element => { element.active = event.checked; return element });
    this.departmentTree = this.nest(this.departments, 0);
  }

  onActiveDepartment(event: CheckboxChangeEvent, departmentCode: string) {
    this.departments = this.departments.map(element => {
      if (departmentCode == element.code) {
        element.active = event.checked;
      }
      return element
    });
  }

  nest(items: DepatmentRightsModel[], id = 0, isSelected = false) {
    return items
      .filter(element => element.parentId === id)
      .map(element => {
        let treeModel: TreeNode = {};
        treeModel.key = element.id.toString();
        treeModel.expanded = true;
        treeModel.type = element.code;
        treeModel.data = {};
        treeModel.data.label = element.name;
        treeModel.data.type = element.code;
        treeModel.data.checked = element.active;
        treeModel.label = element.name;
        if (isSelected == false) {
          treeModel.children = this.nest(items, element.id);
        }
        return treeModel;
      });
  }

}
