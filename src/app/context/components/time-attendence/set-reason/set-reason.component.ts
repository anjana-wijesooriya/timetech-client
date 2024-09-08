import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { IReason } from 'src/app/context/api/time-attendance/reason.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { ReasonService } from 'src/app/context/service/reason.service';
import { SetReasonService } from 'src/app/context/service/set-reason.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { DepartmentModel } from 'd:/Time Tech V2/timetech-client/src/app/context/api/company/department.model';
import { distinctUntilChanged, map, startWith } from 'rxjs';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { WorksheetService } from '../../../service/worksheet.service';
import { TreeNodeSelectEvent } from 'primeng/tree';

@Component({
  selector: 'app-set-reason',
  templateUrl: './set-reason.component.html',
  styleUrl: './set-reason.component.scss'
})
export class SetReasonComponent implements OnInit {
  tableEntries: any[];
  companies: CompanyModel[];
  selectedCompany: CompanyModel;
  isLoading: boolean;
  reasons: IReason[];
  showAddPanel: boolean = false;
  departments: DepartmentModel[];
  departmentTree: any;
  selectedDepartment: any;
  employees: any[];
  selectedEmployee: any;
  selectedReason: any;
  remarks: string = ""
  isLoadingEmployees: boolean = false;
  isSaving: boolean;

  constructor(private setReasonService: SetReasonService, private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private worksheetService: WorksheetService) {

  }

  ngOnInit(): void {
    this.onGetTableEntries();
    this.getReasons()
    this.getCompanies()
    this.onInitBreadcrumbs();
  }

  onInitBreadcrumbs(): void {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/set-reason', label: 'Set Reason', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  onGetTableEntries(): void {
    this.isLoading = true
    const compId = this.baseService.userDetails$.getValue().companyId;
    this.setReasonService.getSetReasons(compId).subscribe(res => {
      this.tableEntries = res.sort((a, b) => Date.parse(b.createdDt) - Date.parse(a.createdDt));
      this.isLoading = false;
    });
  }

  getReasons() {
    const compId = this.baseService.userDetails$.getValue().companyId;
    this.sharedService.getMastersData(6, [{ key: 'CompId', value: compId.toString() }], false).subscribe(res => {
      this.reasons = res.map((a: IReason) => { return { ...a, color: a.color.substring(0, 7) } }) as IReason[];
      this.selectedReason = this.reasons[0].code;
    });
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = res.find(a => a.compId == this.baseService.userDetails$.getValue().companyId);
          this.onChangeCompany(this.selectedCompany.compId);
          // this.getEmployees();

        }
      })
  }

  onChangeCompany(compId) {
    this.selectedCompany.compId = compId;
    this.getDepartments();
  }

  deleteConfirm(event: Event, data: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "pl-2 p-button-primary",
      rejectButtonStyleClass: "p-button-danger p-button-text p-button-outlined",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        // this.isSavingSlideData = true;//
        const { compId } = this.selectedCompany;
        const { id } = this.baseService.userDetails$.getValue()
        data.isDelete = true;
        this.isLoading = true
        this.setReasonService.saveOrUpdate(data).subscribe(res => {
          this.alert.success('Record Deleted')
          this.onGetTableEntries();
          this.isLoading = false;
        }, err => {
          this.alert.error(err);
          this.isLoading = false;
        })
      },
      reject: () => {
        // this.isLoading = false;//
        // this.alert.error('');
      }
    });
  }

  form = new FormGroup({});
  formOptions: FormlyFormOptions;
  fields: FormlyFieldConfig[] = [];
  model: any;

  onSubmit(isDelete: boolean = false) {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    let isValid = true;
    if (this.selectedDepartment == null) {
      this.alert.warn('Please select department');
      isValid = false;
    }
    if (this.selectedEmployee == 0) {
      this.alert.warn('Please select an Employee');
      isValid = false;
    }
    if (this.selectedReason == 0) {
      this.alert.warn('Please select a Reason');
      isValid = false;
    }
    if (this.form.valid && isValid) {
      let data = this.model;
      data = { ...data, ...this.form.value };
      data.deptCd = this.selectedDepartment?.data?.toString()
      data.empID = this.selectedEmployee;
      data.reasonCD = this.selectedReason;
      data.remarks = this.remarks;
      data.fromDt = data.fromDt.toLocaleDateString();
      data.toDt = data.toDt.toLocaleDateString();
      data.isDelete = isDelete;
      data.createdDt = new Date();
      data.CreatedUserName = ".";
      data.EmpCd = '';
      data.EmpName = '';
      data.ReasonName = '';
      this.isSaving = true;
      this.setReasonService.saveOrUpdate(data).subscribe(res => {
        this.alert.success('Record Saved Successfully')
        this.onGetTableEntries();
        this.showAddPanel = !this.showAddPanel;
        this.isSaving = false;
      }, err => {
        this.alert.error(err);
        this.isSaving = false;
      })
    }
  }
  bindForm(item: any) {
    this.showAddPanel = !this.showAddPanel;
    this.form.reset();
    if (item == undefined) {
      item = {} as any;
      item.docDate = new Date().toDateString();
      item.fromDt = new Date();
      item.toDt = new Date();
      item.compId = this.selectedCompany.compId;
      item.createdUser = this.baseService.userDetails$.getValue().id;
      item.lastUpdatedUser = this.baseService.userDetails$.getValue().id;
      item.deptCd = 0;
      item.reasonCD = 0;
      item.empID = 0;
      item.isUpdate = false;
      item.remarks = '';
    } else {
      item.isUpdate = true;
    }
    this.model = item;

    this.formOptions = {};
    this.fields = [
      {
        key: 'docDate',
        type: 'input',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Document Date',
          placeholder: 'Ex: Sick',
          description: 'Description',
          required: false,
          // disabled: true,
          readonly: true,
        },
      },
      {
        key: 'fromDt',
        type: 'datepicker',
        className: 'field py-2 p-fluid',
        props: {
          label: 'Start Date',
          description: 'Description',
          placeholder: '',
          required: true,
          // dateFormat: 'yyyy/MM/dd',
        },
      },
      {
        key: 'toDt',
        type: 'datepicker',
        className: 'field py-2 p-fluid',
        props: {
          label: 'End Date',
          description: 'Description',
          placeholder: '',
          required: true,
          // dateFormat: 'yyyy/MM/dd',
        },
      },
      {
        key: 'compID',
        type: 'select',
        className: 'field py-2 p-fluid',
        defaultValue: this.selectedCompany.compId,
        props: {
          label: 'Company',
          description: 'Description',
          placeholder: 'Select a Company',
          required: true,
          showClear: false,
          options: this.companies.map(a => ({ value: a.compId, label: a.name })),
          attributes: { optionValue: 'compId', optionLabel: 'name', showClear: "false" },
          updateOn: 'change',
          change: (field: FormlyFieldConfig, event?: any) => { this.onChangeCompany(event.value) }
        },
      },
    ];

  }

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(this.selectedCompany.compId).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        // const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        // this.departmentTree.unshift(allCheckNode);
        this.selectedDepartment = tree[0];
        this.getEmployees();
      }
    })
  }

  onChangeDepartment(event: TreeNodeSelectEvent) {
    this.getEmployees();
  }

  getEmployees() {
    this.isLoadingEmployees = true
    const userId = this.baseService.userDetails$.getValue().empId;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany.compId, this.selectedDepartment.data.toString(), userId)
      .subscribe(res => {
        this.employees = res
        this.selectedEmployee = res.length > 0 ? res[0]?.empID : 0;
        this.isLoadingEmployees = false;
      }
      )
  }

  nest(items: DepartmentModel[], id = 0, link = 'parentDepartmentId'): TreeNode[] {
    return items
      .filter(element => element.parentDepartmentId === id)
      .map(element => {
        const childrens = this.nest(items, element.departmentId);
        let treeModel: TreeNode = {
          key: element.departmentCode,
          data: element.departmentId,
          label: element.departmentName,
          children: childrens,

        };
        return treeModel;
      });
  }

}
