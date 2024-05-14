import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterService, MenuItem, MessageService } from 'primeng/api';
import { CommonDataModel } from 'src/app/context/api/shared/common-data.model';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { PhotoService } from 'src/app/context/service/photo.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { EmployeeStateService } from 'src/app/context/service/sharedstate/employee.state.service';
import { UserService } from 'src/app/context/service/user.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
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
  employee: any;
  employeeBasic: any
  userProfiles: CommonDataModel[] = [];
  menuItemsTab: any;

  constructor(private baseService: BaseService, private employeeService: EmployeeService, private layoutService: LayoutService,
    private breadcrumbState: BreadcrumbStateService, private filterService: FilterService,
    private employeeState: EmployeeStateService, private userService: UserService, private photoService: PhotoService,
    public router: Router, public route: ActivatedRoute, private fb: FormBuilder, public messageService: MessageService) { }


  ngOnInit(): void {
    this.initBreadcrumbs();
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
  }

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([
      { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
      { path: '/masters/hr-personal', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
      { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-UserStar' },
      // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic pi-Add-edit' },
    ]);
  }

  onSubmit() { }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }


}
