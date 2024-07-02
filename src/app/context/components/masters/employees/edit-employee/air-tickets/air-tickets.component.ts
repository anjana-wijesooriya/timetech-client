import { DatePipe } from '@angular/common';
import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { DynamicDataModel, EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { AirTicketDetails, AirTicketHistory, IAirSectorSummery, IAirTicketDetails } from '../../../../../api/company/air-ticket.model';
import { EmployeeStateService } from '../../../../../service/sharedstate/employee.state.service';
import { valueOrDefault } from 'src/app/context/shared/helpers/helpers.core';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-air-tickets',
  templateUrl: './air-tickets.component.html',
  styleUrl: './air-tickets.component.scss'
})
export class AirTicketsComponent implements OnInit {
  menuItemsTab: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  @ViewChild('form', { static: false }) form: NgForm;
  attachmentTypes: any[] = [];
  isSaving: boolean = false;
  isLoading: boolean = false;
  airTicketHistory: AirTicketHistory[] = [];
  showAddSlide: boolean = false;
  selectedTicket: AirTicketDetails = new AirTicketDetails();
  ticket: FormGroup<{ [field in keyof AirTicketDetails]?: FormControl<AirTicketDetails[field]> }>;
  ticketListFormGroup: FormGroup<{ [field in keyof AirTicketDetails]?: FormControl<AirTicketDetails[field]> }>;
  //ticket: FormGroup<ControlsOf<AirTicketDetails>>;
  // @ViewChild('addform', { static: false }) addform: NgForm;
  currencies: any[] = [];
  fields: any[] = [];
  @ViewChild('fileUploader', { static: false }) fileUploader: FileUpload;
  @ViewChild('attachment1', { static: false }) image1: Image;
  @ViewChild('attachment2', { static: false }) image2: Image;
  uploadControl = new FormControl('', Validators.required);
  sectors: DynamicDataModel[] = [];
  empAirTickets: any[] = [];
  airInfor: any;
  airSecSummery: IAirSectorSummery;
  ticketTableColumns: any[] = [
    { field: 'id', header: '#' },
    { field: 'name', header: 'Name' },
    { field: 'eligibleTicket', header: 'Eligible Ticket' },
    { field: 'dueOn', header: 'Due On' },
    { field: 'requestTicket', header: 'Requested Tickets' },
    { field: 'amount', header: 'Amount' },
  ]
  selectedRows: any[] = [];
  constructor(private breadcrumbState: BreadcrumbStateService, private baseService: BaseService, private alert: AlertService,
    private employeeService: EmployeeService, private route: ActivatedRoute, private empState: EmployeeStateService,
    private confirm: ConfirmationService, private datePipe: DatePipe, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.menuItemsTab = [
      { label: 'Air Tickets Information', icon: 'pi pi-send' },
      { label: 'Air Tickets History', icon: 'pi pi-history' },
    ];
    this.activeItem = this.menuItemsTab[0];
    this.initBreadcrumbs();
    this.getTicketHistory();
    // this.bindForm();
    this.empState.getEmployeeState().subscribe(res => {
      this.selectedTicket.empName = res?.employeeDetails?.empName;
      this.selectedTicket.imagePath = res?.employeeDetails?.imagePath;
      if (res?.employeeDetails?.compCd) {
        this.getAirSectorSummery(res?.employeeDetails?.compCd);
      }

    })
    this.getCurrencies();
    this.bindForm();
  }

  getCurrencies() {
    this.employeeService.getMastersData(1).subscribe(res => {
      this.currencies = res;
    })
  }

  getAirSectors() {
    const custId = this.baseService.userDetails$.getValue().customerId;
    this.employeeService.getMastersData(2).subscribe(res => {

      this.sectors = res.filter(a => a['custId'] == custId && a['deleted'] == false);
    })
  }

  getAirSectorDetails() {
    const empId = Number(this.route.parent.snapshot.paramMap.get('id'));
    const companyId = this.baseService.userDetails$.getValue().companyId;
    this.isLoading = true;
    this.employeeService.getAirSectorDetails(empId).subscribe(res => {
      this.airInfor = res;
      this.isLoading = false;
    })
  }

  getAirSectorSummery(companyId: number) {
    const empId = Number(this.route.parent.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.employeeService.getAirSectorSummery(empId, companyId, new Date().toISOString()).subscribe(res => {
      this.airSecSummery = res;
      this.isLoading = false;
    })
  }

  bindForm() {
    const formGroupFields = this.getFormControlsFields(this.selectedTicket);
    this.ticket = this.fb.group(formGroupFields);
    // this.fb.array(this.fb.control(''))
    // this.fb.nonNullable.group(formGroupFields);
    // this.ticket.setControl('ticketTakenDt', new FormControl<Date | null>(valueOrDefault(new Date(this.selectedTicket.ticketTakenDt), null), Validators.required));
    // this.ticket.setControl('docDate', new FormControl<Date | null>(valueOrDefault(new Date(this.selectedTicket.docDate), null), Validators.required));
    // this.ticket.setControl('trip1Date', new FormControl<Date | null>(valueOrDefault(new Date(this.selectedTicket.trip1Date), null), Validators.required));
    // this.ticket.setControl('trip2Date', new FormControl<Date | null>(valueOrDefault(new Date(this.selectedTicket.trip2Date), null), Validators.required));
  }

  getFormControlsFields<T>(model: T) {
    let formGroupFields = {}
    for (const key of Object.keys(model)) {
      // formGroupFields.addControl(this.getFormControlsByDataType(key, model, model as IAirTicketDetails));
      // formGroupFields[key] = this.getFormControlsByDataType(key, model, model as IAirTicketDetails);

      formGroupFields[key] = this.getFormControlsByDataType(key, model, model as IAirTicketDetails);
      this.fields.push(key);
    }
    return formGroupFields;
  }

  onUploadImage(event: UploadEvent) {
    let response = event.originalEvent as any;
    if (response?.body?.success && response?.body?.imgUrlList != '') {
      this.selectedTicket.attachment1 = response?.body?.imgUrlList;
      this.ticket.controls.attachment1.patchValue(this.selectedTicket.attachment1);
      // this.selectedAttachment.documentPath = new Utils().getImageBlobUrl(response?.body?.url);
      this.alert.info('File has been attached to the record.');
    } else {
      this.ticket.controls.attachment1.setValue('');
      this.selectedTicket.attachment1 = '';
      this.fileUploader.clear();
    }
  }

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

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  getClassName<T>(obj: T): string {
    return (obj as any).constructor.name;


  }


  getFormControlsByDataType<T, K, P>(property: P, model: T, interf: K) {

    const key = property;
    const keyField = key as (keyof T);

    const value = this.getProperty(model, keyField); // model[key]
    // let className =  instanceof model;
    // type fieldType = ReturnType<typeof key as (keyof T)>;

    // type objType = FunctionReturnType<typeof model>;

    // const className = this.getClassName<T>(model);



    type keyType = T[typeof keyField];

    // let abc: keyType;

    // console.log(abc + ' ' + ' ' + typeof (abc));

    // const keyTypeName = keyType as string; // Assuming keyType is a string

    type Properties = ClassProperties<T>;
    ;

    return new FormControl<P>(value as P, { nonNullable: typeof key != 'object' });

    // switch (typeof (key)) { //(value as keyType) as string
    //   case 'string':
    //     return new FormControl<string>(value as string, { nonNullable: true });
    //   case 'number':
    //     return new FormControl<number>(value as number, { nonNullable: true });
    //   case 'boolean':
    //     return new FormControl<boolean>(value as boolean, { nonNullable: true });
    //   case 'object':
    //     return new FormControl<Date | null>(null);
    //   // if (model[key] == null) {
    //   //   return new FormControl<any>(null);
    //   // }
    //   //console.log(interf[key] + ' - ' + key + ' - ' + value);
    //   //return new FormControl<Date>(valueOrDefault(new Date(value as Date), null));
    //   // return (model[key].constructor.name === 'Date') ? new FormControl<Date>(value as Date) : new FormControl<any>(null);
    //   //return new FormControl<any>(value);
    //   default:
    //     // type aa = IAirTicketDetails.;
    //     return new FormControl<any>(null);
    // }
  }

  isDate(date: Date | any): date is Date {
    return (date as Date).getDate !== undefined;
  }

  printName(toBePrint: IKeyType): toBePrint is string {
    return (toBePrint as string) !== undefined;
  }

  InstanceType<T>(type: Type<T>): T {
    return new type();
  }


  private readonly breadcrumbConfig: { path: string | undefined, label: string, key: string, icon: string }[] = [
    { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
    { path: '/masters/employees', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
    // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
    { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-UserStar' },
    { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}/air-ticket`, label: 'Air Tickets', key: '4', icon: 'font-semibold pi pi-send' },

  ];

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([...this.breadcrumbConfig]);
  }

  getTicketHistory() {
    const empId = Number(this.route.parent.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.employeeService.getTicketHistory(empId).subscribe(res => {
      this.airTicketHistory = res;
      this.isLoading = false;
    })
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MMM-dd');
  }

  onSubmit() { }

  onSubmitDetails() { }

  onCancel() { }

  onEdit(item: AirTicketHistory = undefined) {

    this.showAddSlide = !this.showAddSlide;
    // const emp = this.empState.employeeDetails;
    const empId = Number(this.route.parent.snapshot.paramMap.get('id'));
    if (item != undefined) {
      this.employeeService.getTicketDetails(empId, item.code, item.dependentId).subscribe(res => {
        this.selectedTicket = res;
        this.selectedTicket.dependentName = item.dependentName;

        // this.selectedTicket.ticketTakenDt.
        // this.ticket.patchValue(this.selectedTicket);
        this.bindForm();
      })
    } else {
      this.employeeService.getAirTickets(empId, new Date().toISOString(), this.empState.employeeDetails.compCd).subscribe(res => {
        this.empAirTickets = res;
      })
      this.bindForm();
    }
  }
  deleteConfirm(event: any, item: AirTicketHistory) { }
  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }


}

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};

type ClassProperties<C> = {
  [Key in keyof C as C[Key] extends Function ? never : Key]: C[Key]
}

export type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

export type FunctionReturnType<T> = T extends (...args: any) => infer R ? R : T;

type IKeyType = number | string | boolean | Date | any;

type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

// interface GenericWithDefault<T = string> {
//   myTypeWhichIsStringIfNotSpecified: T;


//   numberType: GenericWithDefault<number> = { myTypeWhichIsStringIfNotSpecified: 1 };

//   // T is string
//   stringType: GenericWithDefault = { myTypeWhichIsStringIfNotSpecified: "string" };

//   // T is string
//   myGeneric3: GenericWithDefault<string> = { myTypeWhichIsStringIfNotSpecified: "string" };
// }
