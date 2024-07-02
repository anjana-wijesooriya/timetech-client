import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterService, MenuItem, MenuItemCommandEvent, MessageService } from 'primeng/api';
import { EditEmployeeModel } from 'src/app/context/api/company/edit-employee.model';
import { CommonDataModel } from 'src/app/context/api/shared/common-data.model';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { PhotoService } from 'src/app/context/service/photo.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { UserService } from 'src/app/context/service/user.service';
import { Utils } from 'src/app/context/shared/utils';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { state } from '@angular/animations';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {

  employeeMenuItems: MenuItem[] = [
    {
      label: 'Navigate To', styleClass: 'text-primary font-bold',
      items: [
        { separator: true },
        { label: 'Employee Overview', icon: 'font-semibold text-lg ic i-Add-UserStar', id: '', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Department Rights', icon: 'font-semibold text-lg ic i-Building', id: '/department-rights', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Documents', icon: 'font-semibold text-lg ic i-Folders', id: '/documents', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Leaves', icon: 'font-semibold text-lg ic i-Home-4', id: '/leaves', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Discipline/Achievement', icon: 'font-semibold text-lg ic i-File-Zip', id: '/', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Attachments', icon: 'font-semibold text-lg pi pi-paperclip', id: '/attachments', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Time Attendance', icon: 'font-semibold text-lg ic i-Time-Window', id: '/time-attendance', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Salary/Bank', icon: 'font-medium text-lg pi pi-dollar', id: '/salary-bank', command: this.onClickEmployeeMenu.bind(this) },
        { label: 'Air Tickets', icon: 'font-medium text-lg pi pi-send', id: '/air-ticket', command: this.onClickEmployeeMenu.bind(this) },
      ]
    }
  ];



  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  menuType: string = 'Tabs';
  menuItems: MenuItem[] | undefined;
  activeItem: MenuItem | undefined; date: Date = new Date();
  activeStep: number | undefined = 0;
  displayGalleria: boolean = false;
  displayFinder: boolean = false;
  displayTerminal: boolean = false;
  images: any[] | undefined;
  selectedMenuItem: MenuItem | undefined = this.employeeMenuItems[0].items[1];

  @ViewChild('employeeMenu', { static: true }) employeeMenu: Menu;

  menuTypeOptions: any[] = [
    { icon: 'Tabs', value: "value" },
    { icon: 'Steps', value: 'Right' },
  ];

  profiles = [
    { name: 'Admin', code: 'NY', id: '1' },
    { name: 'HR', code: 'RM', id: '1' },
    { name: 'Normal', code: 'LDN', id: '2' }
  ];

  dockItems = [];
  rpersons: any[];
  isSaving: boolean;
  arabicRegex: RegExp = /[\u0600-\u06FF]/;
  employee: EditEmployeeModel;
  employeeBasic: any
  userProfiles: CommonDataModel[] = [];
  menuItemsTab: any;
  isLoadingEmpData: boolean = false;

  constructor(private baseService: BaseService, private employeeService: EmployeeService, private layoutService: LayoutService,
    private breadcrumbState: BreadcrumbStateService, private filterService: FilterService,
    private employeeState: EmployeeStateService, private userService: UserService, private photoService: PhotoService,
    public router: Router, public route: ActivatedRoute, private fb: FormBuilder, public messageService: MessageService) { }


  ngOnInit(): void {
    this.initBreadcrumbs();
    this.getEmployeeData();
    this.menuItems = [
      { label: 'General', icon: 'ic i-ID-Card', routerLink: 'general', title: 'General' },
      { label: 'Personal', tooltip: 'Personal', routerLink: 'personal', icon: 'ic i-Male', title: 'hello' },
      { label: 'Contact', tooltip: 'Contact', routerLink: 'contact', icon: 'ic i-Support' },
      { label: 'Dependants', tooltip: 'Dependants', routerLink: 'dependents', icon: 'ic i-Cube-Molecule-2' },
      { label: 'Security', tooltip: 'Security', routerLink: 'security', icon: 'ic i-Firewall' }
    ];
    this.menuItemsTab = [
      { label: 'General', icon: 'ic i-ID-Card' },
      { label: 'Personal', icon: 'ic i-Male' },
      { label: 'Contact', icon: 'ic i-Support' },
      { label: 'Dependants', icon: 'ic i-Cube-Molecule-2' },
      { label: 'Security', icon: 'ic i-Firewall' }
    ];
    this.activeItem = this.menuItemsTab[0];
    this.photoService.getImages().then((images) => (this.images = images));
    this.setItems();
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: 'overlay',
    }));

    this.employeeState.getEmployeeState()
      .subscribe(res => {
        // debugger;
        if (res?.employeeDetails) {
          this.employee = res.employeeDetails;
          this.employeeBasic = {
            empCd: this.employee.empCd,
            desgCd: this.employee.desgDs,
            empShName: this.employee.empShName,
            empName: this.employee.empName,
            compDs: this.employee.compDs,
            deptDs: this.employee.deptDs,
            mobileNo: this.employee.mobileNo,
            email: this.employee.email,
            serviceStartDtString: this.employee.serviceStartDtString,
            // userProfileName: this.userProfiles.find(a => a.id == res.userProfile)?.name
          };
        }
      })
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/hr-personal', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
      { path: `/masters/employees/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-edit' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic pi-Add-edit' },
    ]);
  }

  onClickEmployeeMenu(event: MenuItemCommandEvent) {
    this.selectedMenuItem = event.item;
    const empId = (this.route.snapshot?.paramMap.get('id'));
    this.employeeMenu.hide();
    this.router.navigateByUrl('masters/employees/' + empId + event.item.id);
  }

  onSubmit() { }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  getEmployeeData() {
    // this.spinner.show();
    this.isLoadingEmpData = true;
    const empId = Number(this.route.snapshot?.paramMap.get('id'));
    const result = this.employeeService.getEmployee(empId).subscribe({
      next: res => {
        result.unsubscribe();
        res.imagePath = res?.imagePath == '' ? '' :
          (res.imagePath.includes('.png') || res.imagePath.includes('.jpg'))
            ? this.baseService.apiEndpoint + res.imagePath : new Utils().getImageBlobUrl(res.imageString);
        this.employee = res;
        this.employeeService.setEmployeeObservable(res);
        this.employeeState.setEmployeeDetails(res)
        this.employeeBasic = {
          empCd: this.employee.empCd,
          desgCd: this.employee.desgDs,
          empShName: this.employee.empShName,
          empName: this.employee.empName,
          compDs: this.employee.compDs,
          deptDs: this.employee.deptDs,
          mobileNo: this.employee.mobileNo,
          email: this.employee.email,
          serviceStartDtString: this.employee.serviceStartDtString,
          // userProfileName: this.userProfiles.find(a => a.id == res.userProfile)?.name
        };
        this.getUserProfiles();
        // this.spinner.hide();
        this.isLoadingEmpData = false;

      }, error: err => {
        // this.spinner.hide();
        this.isLoadingEmpData = false;
      }
    })
  }

  getUserProfiles() {
    // this.spinner.show();
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.userService.getUserProfiles(customerId).subscribe({
      next: (res) => {
        this.userProfiles = res;
        // this.spinner.hide();
        this.employeeBasic.userProfileName = res.find(a => a.id == this.employee.userProfile)?.name
      }, error: (err) => {
        // this.spinner.hide();
      },
    })
  }

  setItems() {
    this.dockItems = [
      {
        label: 'Finder',
        tooltipOptions: {
          tooltipLabel: 'Finder',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
        command: () => {
          this.displayFinder = true;
        }
      },
      {
        label: 'Terminal',
        tooltipOptions: {
          tooltipLabel: 'Terminal',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
        command: () => {
          this.displayTerminal = true;
        }
      },
      {
        label: 'App Store',
        tooltipOptions: {
          tooltipLabel: 'App Store',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg',
        command: () => {
          this.messageService.add({ severity: 'error', summary: 'An unexpected error occurred while signing in.', detail: 'UNTRUSTED_CERT_TITLE' });
        }
      },
      {
        label: 'Safari',
        tooltipOptions: {
          tooltipLabel: 'Safari',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/safari.svg',
        command: () => {
          this.messageService.add({ severity: 'warn', summary: 'Safari has stopped working' });
        }
      },
      {
        label: 'Photos',
        tooltipOptions: {
          tooltipLabel: 'Photos',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg',
        command: () => {
          this.displayGalleria = true;
        }
      },
      {
        label: 'GitHub',
        tooltipOptions: {
          tooltipLabel: 'GitHub',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/github.svg'
      },
      {
        label: 'Trash',
        tooltipOptions: {
          tooltipLabel: 'Trash',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Empty Trash' });
        }
      }
    ];
  }

}
