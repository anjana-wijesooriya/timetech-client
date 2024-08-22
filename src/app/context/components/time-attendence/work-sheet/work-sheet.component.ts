import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, TreeNode } from 'primeng/api';
import { FileUploadErrorEvent, UploadEvent } from 'primeng/fileupload';
import { DepartmentModel } from 'src/app/context/api/company/department.model';
import { WorkRuleModel } from 'src/app/context/api/company/employee-support-data.model';
import { IReason } from 'src/app/context/api/time-attendance/reason.model';
import { IWorksheet, IWorksheetModel, MachinePunch } from 'src/app/context/api/time-attendance/worksheet.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { WorkRuleService } from 'src/app/context/service/workrule.service';
import { WorksheetService } from 'src/app/context/service/worksheet.service';
import { Utils } from 'src/app/context/shared/utils';

@Component({
  selector: 'app-work-sheet',
  templateUrl: './work-sheet.component.html',
  styleUrl: './work-sheet.component.scss'
})
export class WorkSheetComponent implements OnInit {
  companies: any;
  selectedCompany: any;
  departments: DepartmentModel[];
  departmentTree: TreeNode<any>[];
  selectedEmployees: any[] = [];
  employees: any[] = [];
  selectedReason: any = 0;
  reasons: any[] = [];
  fromDate: Date = new Date('07/31/2023');
  toDate: Date = new Date('08/01/2023');
  worksheets: IWorksheetModel[] = [];
  virtualWorksheets: IWorksheetModel[] = [];
  isLoading: boolean = false;
  selectedDepartments: any[] = [];
  rowsPerPage: number = 25;
  first: number = 0;
  empCode: string = "";
  empName: string = "";
  shifts: any[];
  workRules: WorkRuleModel[] = []
  uploadControl = new FormControl('', Validators.required);
  selectedWorksheet: IWorksheet;
  formgroup: FormGroup = new FormGroup({});
  isLoadingData: boolean;
  punchData: any;
  machineData: any;
  isLoadingPunchData: boolean;
  viewType: number = 0;
  utils: Utils = new Utils();
  showChangeShiftPanel: boolean = false
  showAddLeavePanel: boolean = false
  leaves: any[];
  slideType: number = 0;
  selectedLeaveType: number;
  selectedShift: number;
  isSavingSlideData: boolean;
  isResetting: boolean;

  constructor(private worksheetService: WorksheetService, private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private employeeService: EmployeeService, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private fb: FormBuilder, private datepipe: DatePipe) { }


  ngOnInit(): void {
    this.getCompanies();
    this.initBreadcrumbs();
    this.getShifts(this.baseService.userDetails$.getValue().companyId);
    this.getWorkRules(this.baseService.userDetails$.getValue().companyId);

  }

  bindForm(isRefresh: boolean = false) {

    for (let key in this.selectedWorksheet) {

      if (typeof this.selectedWorksheet[key] === "string" && (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(this.selectedWorksheet[key]) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(this.selectedWorksheet[key])
        || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/.test(this.selectedWorksheet[key]) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{1}$/.test(this.selectedWorksheet[key]))) {
        this.selectedWorksheet[key] = this.getFromatedDate(new Date(this.selectedWorksheet[key]));
      }
    }

    let { timeIn, timeOut } = this.selectedWorksheet;

    const offset = timeIn.getTimezoneOffset();
    if (!isRefresh) {
      timeIn = new Date(timeIn.setMinutes(timeIn.getMinutes() - offset));
      timeOut = new Date(timeOut.setMinutes(timeOut.getMinutes() - offset));
    }
    this.formgroup = this.fb.nonNullable.group({
      shiftIN: new FormControl<Date>(this.selectedWorksheet.shiftIN),
      shiftOUT: new FormControl<Date>(this.selectedWorksheet.shiftOUT),
      timeIn: new FormControl<string>(this.getFormattedTime(timeIn)),
      timeOut: new FormControl<string>(this.getFormattedTime(timeOut)),
      nh: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.nh)),
      missTime: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.missTime)),
      oT1: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.oT1)),
      oT2: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.oT2)),
      oT3: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.oT3)),
      graceLE: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.graceLE)),
      graceEE: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.graceEE)),
      earlyExitHrs: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.earlyExitHrs)),
      lateEntryHrs: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.lateEntryHrs)),
      brkHrs: new FormControl<string>(this.getDateByMinutes(this.selectedWorksheet.brkHrs)),
      reason: new FormControl<number>(this.selectedWorksheet.reason),
      wr: new FormControl<number>(this.selectedWorksheet.wr),
      nextDay: new FormControl<boolean>(this.selectedWorksheet.nextDay),
      shiftOutNextDay: new FormControl<boolean>(this.selectedWorksheet.shiftOutNextDay),
      shift: new FormControl<number>(this.selectedWorksheet.shift),
      empRemarks: new FormControl<string>(this.selectedWorksheet.empRemarks),
      remarks: new FormControl<string>(this.selectedWorksheet.remarks),

    });

    this.formgroup.get('shiftIN').disable();
    this.formgroup.get('shiftOUT').disable();
    this.formgroup.get('shiftOutNextDay').disable();

    this.selectedShift = this.selectedWorksheet.shift;
  }

  getLeaves(empId: number) {
    // this.isLoading = true;
    this.employeeService.getLeaves(empId).subscribe(res => {
      this.leaves = res
      // this.isLoading = false;
      this.selectedLeaveType = res[0]?.leaveCd;
    });
  }

  onOpenShiftSlide(type: number = 0) {
    this.slideType = type;
    this.showChangeShiftPanel = !this.showChangeShiftPanel
  }

  sumbitSlideData() {

  }

  getDay(day) {
    return this.utils.DAYS[new Date(day).getDay()].substring(0, 2);
  }

  getLocalDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }

  get getTableWidth() {
    const width = document.querySelector('app-breadcrumbs .surface-card').scrollWidth;
    return {
      'width': `${(this.pxToRem(width) - 2).toString()}rem`,
      'max-width': `${(this.pxToRem(width) - 2).toString()}rem`
    };
  }

  pxToRem(px) {
    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return Math.round(px / baseFontSize);
  }

  getDateByMinutes(mins: number) {
    let date = new Date(new Date(0).setMinutes(mins));
    return this.formatTime(date);
  }

  getFromatedDate(date: Date) {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    console.log(new Date(new Date(formattedDate).setSeconds(0)));
    return new Date(new Date(formattedDate).setSeconds(0));
  }

  formatTime(date: Date) {
    const hours = this.datepipe.transform(date, 'HH:mm', '+0000', 'en-US');
    return hours;
  }

  getUTCFormattedDate(value: any) {
    if (typeof (value) == 'string') {
      return new Date(value.replace('1900', '1970'));
    }
    return value;
  }

  getFormattedTime(date: Date) {
    const hours = date.getHours();
    const mins = date.getMinutes();
    const newDate = new Date(new Date(new Date(0).setMinutes(mins)).setHours(hours))
    const time = this.datepipe.transform(newDate, 'HH:mm', '+0000', 'en-US');
    return time;
  }

  getTime(field: string) {
    return this.formgroup.get(field).value.toString();
  }

  ontimeChange(event, fromControlName) {
    this.formgroup.patchValue({ [fromControlName]: event });
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Time Attendance', key: '1', icon: 'pi pi-share-alt' },
      { path: '/time-attendance/shift', label: 'Daily Worksheet', key: '2', icon: ' text-bold pi pi-calendar-times' },
    ]);
  }

  getCompanies() {
    this.isLoading = true;
    this.companyService.getCompanies(this.baseService.userDetails$.getValue().customerId)
      .subscribe({
        next: res => {
          this.companies = res.map(element => {
            element.logo = (element.code == 'TTB' ? 'bh' : element.code == 'TTS' ? 'sa' : 'kw');
            return element;
          });
          this.selectedCompany = res.find(a => a.compId == this.baseService.userDetails$.getValue().companyId);
          // this.onChangeCompany(this.selectedComapny);
          // this.getEmployees();
          this.getDepartments();
          this.getEmployees();
          this.getResons();
          this.isLoading = false;
        }
      })
  }

  getShifts(companyId = 0) {
    this.isLoading = true;
    let filters = [];
    filters.push({ "key": "CompId", "value": companyId.toString() });
    filters.push({ "key": "DeptId", "value": "0" });
    this.sharedService.getMastersData(4, filters, false).subscribe(res => {
      this.isLoading = false;
      this.shifts = res as any[];
    })
  }

  getWorkRules(companyId = 0) {
    this.isLoading = true;
    this.employeeService.getWorkRules(companyId).subscribe(res => {
      this.workRules = res;
      this.isLoading = false;
    })
  }

  onChangeCompany() {
    this.getDepartments();
    this.getShifts(this.selectedCompany.compId);
    this.getWorkRules(this.selectedCompany.compId);
    this.getResons();
  }

  getEmployees() {
    const depIds = this.selectedDepartments.map(a => a.data).join(',');
    const userId = this.baseService.userDetails$.getValue().empId;
    this.worksheetService.getEmployeesByDepartment(this.selectedCompany.compId, depIds, userId)
      .subscribe(res => {
        this.employees = res
      }
      )
  }

  onSubmitSlideData() {
    const user = this.baseService.userDetails$.getValue();
    const payload: any = {
      empId: this.selectedWorksheet.empID,
      transactionDate: this.selectedWorksheet.trnDate,
      shiftId: this.selectedShift,
      CompanyId: this.selectedCompany.compId,
      reasonId: this.selectedLeaveType,
      userId: user.id,
      isDelete: false
    };

    this.isSavingSlideData = true;
    this.getSlideSaveMethod(payload).subscribe(res => {

      this.alert.success("Data updated Successfully");
      this.isSavingSlideData = false;
      this.showChangeShiftPanel = !this.showChangeShiftPanel;
    }, err => {
      this.alert.error(err);
      this.isSavingSlideData = false;
    });
  }

  getSlideSaveMethod(data) {
    return this.slideType == 0 ? this.worksheetService.setLeave(data) : this.worksheetService.changeShift(data);
  }

  onGetTableEntries(name = '', code = ''): void {
    const userId = this.baseService.userDetails$.getValue().empId;

    const depIds = this.selectedDepartments.map(a => a.data).join(',');
    const empIds = this.selectedEmployees.join(',');
    this.isLoading = true;

    // this.virtualWorksheets.push(aa as any);
    this.worksheetService.getWorksheets(this.selectedCompany.compId, this.selectedReason, userId, {
      from: this.fromDate, to: this.toDate, name: this.empName, code: this.empCode, deptIds: depIds, empIds: empIds
    }).subscribe(res => {
      this.worksheets = res;
      this.virtualWorksheets = res
      this.isLoading = false;

    }, err => {
      this.isLoading = false;
    });
  }

  processData() {
    const userId = this.baseService.userDetails$.getValue().empId;

    const depIds = this.selectedDepartments.map(a => a.data).join(',');
    this.isLoading = true;
    this.worksheetService.processData(this.selectedCompany.compId, depIds, '', userId, this.fromDate.toISOString(), this.toDate.toISOString()).subscribe(res => {
      this.worksheets = res;
      this.virtualWorksheets = res//.slice(0, 25)
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  transform(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}:${minutes}`;
  }

  getResons() {
    this.sharedService.getMastersData(6, [{ key: 'CompId', value: this.selectedCompany.compId.toString() }], false).subscribe(res => {
      this.reasons = res.map((a: IReason) => { return { ...a, color: a.color.substring(0, 7) } }) as IReason[];
      this.selectedReason = 29;
    });
  }

  pageChange(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    //simulate remote connection with a timeout
    setTimeout(() => {
      //load data of required page
      let loadedData = this.worksheets.slice(event.first, event.first + event.rows);

      //populate page of virtual cars
      Array.prototype.splice.apply(this.virtualWorksheets, [...[event.first, event.rows], ...loadedData]);

      //trigger change detection
      event.forceUpdate();
    }, Math.random() * 1000 + 250);
  }

  onUploadImage(event: UploadEvent) {
    let response = event.originalEvent as any;
    this.alert.info('File has been attached to the record.');
  }

  onUploadError(event: FileUploadErrorEvent) {
    this.alert.error("Attachment upload fail. Please try again.");
  }

  get fileUploadUrl() {
    if (this.selectedWorksheet) {
      return this.baseService.apiEndpoint + 'api/worksheets/save-attachment?attachmentType=2&folderPathId=3&empId=' + this.selectedWorksheet.empID + "&date=" + this.selectedWorksheet.trnDate.toJSON()
    }
    return ""
  }

  onBeforeUpload(event) { }

  downloadAttachment(path: string) {
    this.employeeService.downloadFile(path.replace(this.baseService.apiEndpoint, '')).subscribe(res => {

      const b64Data = res.base64String;
      const contentType = res.extention;

      // Decode the Base64 string
      const byteCharacters = atob(b64Data);

      // Create an array of byte values
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Convert the array of byte values to a Uint8Array
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the Uint8Array
      const blob = new Blob([byteArray], { type: contentType });

      // Now you can use the blob as needed (e.g., display it to the user)
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    });

  }

  getDocumentIconByUrl(url: string) {
    return url.includes('.pdf') ? 'pi pi-file-pdf text-5xl' : 'pi pi-image text-5xl';
  }

  onSearchWorksheets() {
    this.onGetTableEntries();
  }

  onEdit(data: any) {
    this.selectedWorksheet = data;
    this.selectedWorksheet.shiftIN = this.getUTCFormattedDate(data.shiftIN);
    this.selectedWorksheet.shiftOUT = this.getUTCFormattedDate(data.shiftOUT);
    this.selectedWorksheet.timeIn = this.getUTCFormattedDate(data.timeIn);
    this.selectedWorksheet.timeOut = this.getUTCFormattedDate(data.timeOut);
    this.selectedWorksheet.trnDate = this.getUTCFormattedDate(data.trnDate);
    this.viewType = 1
    this.bindForm();
    this.getPunchData()
    this.getLeaves(this.selectedWorksheet.empID);
  }

  refreshData() {
    this.bindForm();
    this.getPunchData()
  }

  resetData() {
    this.isResetting = true;
    const { id } = this.baseService.userDetails$.getValue();
    const { empID, trnDate } = this.selectedWorksheet;
    this.worksheetService.reset(empID, id, this.getLocalDate(trnDate)).subscribe(res => {
      console.log(res);
      this.alert.success("Data has been Reset.")
      this.isResetting = false;
    }, error => {
      this.alert.error(error);
      this.isResetting = false;
    })
  }

  goBack() {
    this.viewType = 0;
  }

  getPunchData() {
    this.isLoadingData = true;
    const { empID, shift, trnDate } = this.selectedWorksheet;
    this.worksheetService.getAttendanceData(this.selectedCompany.compId, empID, shift, trnDate.toJSON()).subscribe(res => {
      this.punchData = res?.punchData;
      this.machineData = res?.machineData;
      this.isLoadingData = false;
    }, err => {
      this.isLoadingData = false;
    })
  }

  isUpdating: boolean = false;
  onUpdateAttendance() {
    let data = { ...this.selectedWorksheet, ...this.formgroup.value }
    const { compId } = this.selectedCompany;
    const { id, profileId } = this.baseService.userDetails$.getValue();

    data.nh = this.timeToHours(data.nh);
    data.brkHrs = this.timeToHours(data.brkHrs);
    data.earlyExitHrs = this.timeToHours(data.earlyExitHrs);
    data.graceEE = this.timeToHours(data.graceEE);
    data.graceLE = this.timeToHours(data.graceLE);
    data.lateEntryHrs = this.timeToHours(data.lateEntryHrs);
    data.missTime = this.timeToHours(data.missTime);
    data.oT1 = this.timeToHours(data.oT1);
    data.oT2 = this.timeToHours(data.oT2);
    data.oT3 = this.timeToHours(data.oT3);
    data.timeIn = data.timeIn; //new Date(new Date(0).setMinutes(this.timeToHours(data.timeIn))).toJSON();
    data.timeOut = data.timeOut;// new Date(new Date(0).setMinutes(this.timeToHours(data.timeOut))).toJSON();
    console.log(data);
    this.isUpdating = true;
    this.worksheetService.saveAttendanceData(compId, id, profileId, data).subscribe(res => {
      this.alert.success("Attendance data has been updated.");
      this.onGetTableEntries();
      this.viewType = 0;
      this.isUpdating = false;
    }, err => {
      this.alert.error(err);
      this.isUpdating = false;
    })
  }

  calculating: boolean = false;
  onCalculate() {
    this.calculating = true;

    let data = { ...this.selectedWorksheet, ...this.formgroup.value }
    const { compId } = this.selectedCompany;
    const { id, profileId } = this.baseService.userDetails$.getValue();

    data.nh = this.timeToHours(data.nh);
    data.brkHrs = this.timeToHours(data.brkHrs);
    data.earlyExitHrs = this.timeToHours(data.earlyExitHrs);
    data.graceEE = this.timeToHours(data.graceEE);
    data.graceLE = this.timeToHours(data.graceLE);
    data.lateEntryHrs = this.timeToHours(data.lateEntryHrs);
    data.missTime = this.timeToHours(data.missTime);
    data.oT1 = this.timeToHours(data.oT1);
    data.oT2 = this.timeToHours(data.oT2);
    data.oT3 = this.timeToHours(data.oT3);
    data.timeIn = data.timeIn;
    data.timeOut = data.timeOut;
    data.empCd = 0;
    console.log(data);
    this.worksheetService.calculateAttendance(compId, id, profileId, data).subscribe(res => {
      this.alert.success("Attendance data has been Calculated.");


      this.formgroup.patchValue({
        nh: this.getDateByMinutes(res.nh),
        oT1: this.getDateByMinutes(res.oT1),
        oT2: this.getDateByMinutes(res.oT2),
        oT3: this.getDateByMinutes(res.oT3),
        missTime: this.getDateByMinutes(res.miss),
        brkHrs: this.getDateByMinutes(res.breakHrs),
        earlyExitHrs: this.getDateByMinutes(res.ee),
        lateEntryHrs: this.getDateByMinutes(res.le),
      });

      this.formgroup.get('shift').disable();
      this.formgroup.get('wr').disable();
      this.calculating = false;
    }, err => {
      this.alert.error(err);
      this.calculating = false;
    })
  }

  getDepartments() {
    const user = this.baseService.userDetails$.getValue()
    this.companyService.getDepartments(this.selectedCompany.compId).subscribe({
      next: res => {
        this.departments = res;
        let tree = this.nest(res);
        const allCheckNode: TreeNode = { key: 'ALL', label: 'All Departments', icon: '', children: [], checked: false };
        this.departmentTree = tree;
        this.departmentTree.unshift(allCheckNode);
      }
    })
  }

  nodeSelect(event, departments = this.departmentTree) {
    if (event.node.label === 'All Departments') {
      departments.forEach(dep => {
        dep.checked = true;
        this.selectedDepartments.push(dep);
        if (dep.children && dep.children.length > 0) {
          this.nodeSelect(event, dep.children);
        }
      })
      this.getEmployees();
    }
  }

  nodeUnselect(event) {
    if (event.node.label === 'All Departments') {
      this.selectedDepartments = [];
      this.employees = [];
    }
  }

  deselectChildNodes(node: TreeNode) {
    if (node.children) {
      node.children.forEach(child => {
        const index = this.selectedDepartments.indexOf(child);
        if (index !== -1) {
          this.selectedDepartments.splice(index, 1);
        }
        this.deselectChildNodes(child);
      });
    }
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

  timeToHours(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 60) + minutes;
  }

  punchForm: FormGroup = new FormGroup({});
  showAddPanel: boolean = false;
  isSavingPunch: boolean = false;

  bindPunchForm() {
    this.showAddPanel = !this.showAddPanel;

    this.punchForm = this.fb.nonNullable.group({
      tranDate: new FormControl(new Date(this.selectedWorksheet.trnDate)),
      tranTime: new FormControl('00:00'),
      tranType: new FormControl('In'),
    })
    this.punchForm.get('tranDate').disable();
  }

  getPunchTime() {
    this.punchForm.get('tranTime').value.toString();
  }

  onChangePunchTime(event) {
    this.punchForm.patchValue({ tranTime: event });
  }

  onSubmitPunch() {
    console.log(this.punchForm.value);
    this.isLoadingPunchData = true;
    const { id } = this.baseService.userDetails$.getValue()
    let data = new MachinePunch();
    const formdata = this.punchForm.value;
    data.trnTime = formdata.tranTime;
    data.trnDate = this.selectedWorksheet.trnDate.toJSON();
    data.trnType = formdata.tranType;
    data.projectID = this.selectedWorksheet.shift;
    data.empID = this.selectedWorksheet.empID;
    data.machPunchS = "";
    const { compId } = this.selectedCompany;
    this.worksheetService.addPunch(compId, id, data).subscribe(res => {
      this.getPunchData();
      this.punchForm.reset();
      this.showAddPanel = !this.showAddPanel;
      this.alert.success("Punch data added");
      this.isLoadingPunchData = false;
    }, err => {
      this.alert.error(err);
      this.isLoadingPunchData = false
    })

  }

  deleteConfirm(event: Event, data: any) {
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
        // this.isSavingSlideData = true;//
        const { compId } = this.selectedCompany;
        const { id } = this.baseService.userDetails$.getValue()
        this.worksheetService.deletePunch(compId, id, data).subscribe(res => {
          this.alert.success('Record deleted');
          this.getPunchData();
          // this.isSavingSlideData = false;//
        });
      },
      reject: () => {
        // this.isLoading = false;//
        // this.alert.error('');
      }
    });
  }
}
