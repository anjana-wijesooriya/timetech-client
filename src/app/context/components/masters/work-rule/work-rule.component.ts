import { FormlyFieldSelect } from '@ngx-formly/primeng/select';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { CompanyModel } from 'src/app/context/api/company/company.model';
import { WorkRuleModel } from 'src/app/context/api/company/employee-support-data.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { HolidayService } from 'src/app/context/service/holiday.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { environment } from 'src/environments/environment';
import { InputFieldWrapper } from '../../utilities/field-wrappers/input-wrapper.component';
import { InputSwitch } from 'primeng/inputswitch';
import { WorkRuleService } from 'src/app/context/service/workrule.service';
import { Utils } from 'src/app/context/shared/utils';
import { ShiftModel } from 'src/app/context/api/time-attendance/shift.model';
import { TabViewChangeEvent } from 'primeng/tabview';
import { DepartmentModel } from 'd:/Time Tech V2/timetech-client/src/app/context/api/company/department.model';

@Component({
  selector: 'app-work-rule',
  templateUrl: './work-rule.component.html',
  styleUrl: './work-rule.component.scss'
})
export class WorkRuleComponent implements OnInit {

  workRules: WorkRuleModel[] = [];
  isLoading: boolean;
  companies: CompanyModel[];
  selectedCompany: CompanyModel;
  showAddPanel: boolean = false;
  model: WorkRuleModel;
  modelClone: WorkRuleModel;
  form = new FormGroup({});
  formOptions: FormlyFormOptions;
  fields: FormlyFieldConfig[] = [];
  clonedTemplateTableEntries: { [s: string]: any } = {};
  mode: string = 'list';
  util: Utils = new Utils();
  selectedRule: number = 0;

  scrollableTabs: MenuItem[] = this.util.WORKINGDAYS.map(a => ({ label: a, id: a.toUpperCase().substring(0, 3) } as MenuItem));
  activeIndex: MenuItem = this.scrollableTabs[0];
  shifts: ShiftModel[] = [];
  templates: any[];
  templateTableEntries: any[];
  departments: import("d:/Time Tech V2/timetech-client/src/app/context/api/company/department.model").DepartmentModel[];
  departmentTree: TreeNode<any>[];
  showLinkPanel: boolean = false;
  depForm: FormGroup = new FormGroup({});
  loadingDept: boolean;
  selectedWorkRuleModel: WorkRuleModel;

  constructor(private workRuleService: WorkRuleService, private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private employeeService: EmployeeService, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.getWorkRules();
    this.getCompanies();
    this.onViewTemplate();
    this.getDepartments();
    this.bindDepartmentForm();
  }

  bindDepartmentForm() {
    this.depForm = new FormGroup({
      workRuleId: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      startDate: new FormControl(new Date(), Validators.required)
    })
  }

  onSaveLinkDepartments() {
    this.depForm.markAllAsTouched();
    if (this.depForm.valid) {
      let entity = this.depForm.value;
      const user = this.baseService.userDetails$.getValue();

      entity.empId = user.empId;
      entity.companyId = user.companyId;
      entity.departmentId = entity.department.data;
      entity.day = "";

      this.loadingDept = true;

      this.workRuleService.assignRuleToDepartment(entity).subscribe(res => {
        this.alert.success('Record Updated.');
        this.depForm.reset();
        this.showLinkPanel = !this.showLinkPanel;
        this.loadingDept = false;
      }, err => {
        this.alert.error(err);
        this.loadingDept = false;
      })
    }
  }

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(user.companyId).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        this.departmentTree.unshift(allCheckNode);
      }
    })
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

  onViewTemplate() {
    this.getShiftTableEntries();
    // this.changeMode('view', undefined);
  }
  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/work-rule', label: 'Work Rules', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getTemplatesByRuleId(ruleId) {
    this.selectedRule = ruleId;
    let filters = [];
    filters.push({ "key": "CompId", "value": this.baseService.userDetails$.getValue().companyId.toString() });
    filters.push({ "key": "WorkRule", "value": ruleId.toString() });
    this.isLoading = true;
    this.sharedService.getMastersData(8, filters, false).subscribe(res => {
      this.templates = res as any[];
      const key = this.activeIndex.label.toUpperCase();
      // this.templateTableEntries = this.templates.filter(a => a.workDay == key);
      this.templateTableEntries = this.templates.filter((a: any) => key.includes(a.workDay)).map((a: any) => {
        const shift = this.shifts.find(b => b.code == a.shift);
        return { ...shift, workRuleId: a.workRuleId, workDay: a.workDay, seq: a.seq };
      });
      this.isLoading = false;
    })
  }

  getWorkRules() {
    this.isLoading = true;
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.employeeService.getWorkRules(companyId).subscribe(res => {
      this.workRules = res;
      this.isLoading = false;
      this.getTemplatesByRuleId(res[0].code);
    })
  }

  getShiftTableEntries() {
    this.isLoading = true;
    let filters = [];
    filters.push({ "key": "CompId", "value": this.baseService.userDetails$.getValue().companyId.toString() });
    filters.push({ "key": "DeptId", "value": "0" });
    this.sharedService.getMastersData(4, filters, true).subscribe(res => {
      this.isLoading = false;
      this.shifts = res as ShiftModel[];
    })
  }

  onChangeTabIndex(event: MenuItem) {
    if (this.templates) {
      const key = event.label.toUpperCase();
      // this.templateTableEntries = this.templates.filter(a => a.workDay == key);
      this.templateTableEntries = this.templates.filter((a: any) => key.includes(a.workDay)).map((a: any) => {
        const shift = this.shifts.find(b => b.code == a.shift);
        return { ...shift, lastUpdatedUser: a.workRule, workDay: a.workDay, seq: a.seq };
      });
    } else {
      this.templateTableEntries = [];
    }
  }

  getCompanies() {
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          res
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = res.find(a => a.compId == this.baseService.userDetails$.getValue().companyId);
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
        }
      })
  }

  openAddOrEditPanel(model: WorkRuleModel = undefined) {
    this.showAddPanel = true;
    this.bindForm(model);
  }

  changeMode(mode: string, data: WorkRuleModel) {
    this.mode = mode;
    switch (mode) {
      case 'template':
        this.getTemplatesByRuleId(data.code);
        this.selectedWorkRuleModel = data;
        break;
      case 'list':

      default:
        break;
    }

  }

  onRowEditInit(item: any) {
    this.clonedTemplateTableEntries[item.id as string] = { ...item };
  }

  onRowEditSave(item: any) {
    delete this.clonedTemplateTableEntries[item.id as string];
    this.isLoading = true;
    this.workRuleService.updateSequence({
      workRuleId: this.selectedRule, shiftId: item.code, Sequence: item.seq, day: item.workDay
    }).subscribe(res => {
      this.alert.success('Recored Updated');
      this.isLoading = false;
    }, err => {
      this.alert.error(err);
      this.isLoading = false;
    })
  }

  onRowEditCancel(item: any, index: number) {
    this.templateTableEntries[index] = this.clonedTemplateTableEntries[item.id as string];
    delete this.clonedTemplateTableEntries[item.id as string];
  }

  onDeleteTemplateRecord(event: Event, data: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        this.isLoading = true;
        const user = this.baseService.userDetails$.getValue();
        this.workRuleService.deleteShiftTemplate(user.companyId, this.selectedRule, data.code, this.activeIndex.id).subscribe(res => {
          this.alert.success('Record deleted');
          this.getTemplatesByRuleId(this.selectedRule);
          this.isLoading = false;
        }, err => {
          this.alert.error(err);
        });
      },
      reject: () => {
        this.isLoading = false;
        // this.alert.error('');
      }
    });
  }

  onLinkTemplateRecord(item: any) {
    this.isLoading = true;
    const user = this.baseService.userDetails$.getValue();
    this.workRuleService.linkShift({
      workRuleId: this.selectedRule, shiftId: item.code, day: this.activeIndex.id,
      companyId: user.companyId, empId: user.empId
    }).subscribe(res => {
      this.alert.success('Shift has been linked.');
      this.getTemplatesByRuleId(this.selectedRule);
      this.isLoading = false;
    }, err => {
      this.alert.error(err);
      this.isLoading = false;
    })
  }

  submit() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      let entry = {};
      if (this.model.isUpdateMode) {
        entry = {
          compId: this.model.companyId,
          code: this.model.code,
          name: this.model.name,
          lastUpdatedUser: this.baseService.userDetails$.getValue().empId,
          lastUpdateDt: new Date(),
          createdUser: this.baseService.userDetails$.getValue().empId,
          createdDt: new Date(),
          active: this.model.active
        }
      } else {
        entry = {
          compId: this.model.companyId,
          name: this.model.name,
          lastUpdatedUser: this.baseService.userDetails$.getValue().empId,
          lastUpdateDt: new Date(),
          createdUser: this.baseService.userDetails$.getValue().empId,
          createdDt: new Date(),
          active: this.model.active
        }
      }
      this.workRuleService.saveOrUpdate(entry).subscribe(res => {
        this.alert.success('Record updated successfully.')
        this.getWorkRules();
        this.showAddPanel = !this.showAddPanel;
      },
        error => {
          this.alert.error(error)
        })
    }
  }

  deleteConfirm(event: Event, data: WorkRuleModel) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check mr-2",
      rejectIcon: "pi pi-times mr-2",

      accept: () => {
        this.isLoading = true;
        this.workRuleService.delete(data.companyId, data.code, this.baseService.userDetails$.getValue().empId).subscribe(res => {
          this.alert.success('Record deleted');
          this.getWorkRules();
          this.isLoading = false;
        });
      },
      reject: () => {
        this.isLoading = false;
        // this.alert.error('');
      }
    });
  }

  bindForm(data: WorkRuleModel) {
    this.form.reset();
    if (data == undefined) {
      data = {} as WorkRuleModel;
      data.companyId = this.selectedCompany.compId;
      data.lastUpdatedUser = this.baseService.userDetails$.getValue().empId;
      data.active = true;
      data.isUpdateMode = false;
    } else {
      data.isUpdateMode = true;
    }

    this.model = data;

    this.formOptions = {
    };
    this.fields = [
      {
        key: 'name',
        type: 'input',
        // wrappers: [InputFieldWrapper],
        className: 'field py-2',
        props: {
          label: 'Work Rule Name',
          placeholder: 'Ex: 8 Hours Shift',
          description: 'Description',
          required: true,
        },
      },
      {
        key: 'companyId',
        type: 'select',
        className: 'field py-2',
        props: {
          label: 'Company',
          description: 'Description',
          placeholder: 'Select a Company',
          required: true,
          options: this.companies.map(a => ({ value: a.compId, label: a.name })),
          attributes: { optionValue: 'compId', optionLabel: 'name' }
        },
      },
      {
        key: 'active',
        type: 'switch',
        className: 'field py-2',
        props: {
          label: 'Active Status',
          description: '',
          pattern: 'true',
          required: false,

        },
        // template: `<div class="w-full py-2">
        //         <label for="float-label" class="font-medium text-900">Reimbursement</label>
        //         <div class="flex align-items-center w-auto">
        //             <p-inputSwitch class="p-inputSwitch-lg" triggers="focus"></p-inputSwitch>
        //         </div>
        //     </div>`
      }
    ];
  }

}
