import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { SharedService } from 'src/app/context/service/shared.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { ShiftService } from 'src/app/context/service/shift.service';

@Component({
  selector: 'app-scheduling-shift-wr',
  templateUrl: './scheduling-shift-wr.component.html',
  styleUrl: './scheduling-shift-wr.component.scss'
})
export class SchedulingShiftWrComponent implements OnInit {
  loading: boolean;
  entries: any[] = [];
  table: any;

  data = signal(this.entries);

  constructor(private sharedService: SharedService, private breadcrumbState: BreadcrumbStateService, private companyService: CompanyService,
    private fb: FormBuilder, private alert: AlertService, public baseService: BaseService, private confirmationService: ConfirmationService,
    private shiftService: ShiftService, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.table = createAngularTable(() => ({
      data: this.data(),
      columns: this.getColumns(),
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
    }))
    this.getEntries();
  }

  getEntries() {
    this.loading = true;
    const { companyId, id } = this.baseService.userDetails$.getValue(); 
    this.shiftService.getShiftWorkrule(companyId, id, false).subscribe(res => {
      this.entries = res;
      this.data.set(this.entries);
      this.loading = false;
    })
  }

  getColumns() {
    return [
      { accessorKey: 'docNo', header: () => 'Doc No' },
      { accessorKey: 'fromDt', header: () => 'From', cell: info => this.datepipe.transform(info.getValue(), 'dd-MM-yyyy') },
      { accessorKey: 'toDt', header: () => 'To' },
      { accessorKey: 'havingWR', header: () => 'Having Workrule' },
      { accessorKey: 'shiftName', header: () => 'Shift' },
      { accessorKey: 'workrule', header: () => 'Workrule' },
      { accessorKey: 'muslim', header: () => 'Muslim Only' },
      { accessorKey: 'createdBy', header: () => 'Creator' },
      { accessorKey: 'createdOn', header: () => 'Deleted' },
      { accessorKey: 'deleted', header: () => 'DeletedBy' },
      { accessorKey: 'deletedBy', header: () => 'Rollbacked' },
      { accessorKey: 'allDept', header: () => 'All Dept' },
      { accessorKey: 'allEmp', header: () => 'All Emp' },
      { accessorKey: 'canDeleted', header: () => 'Rollback' },
      { accessorKey: 'canRollback', header: () => 'Actions' },
    ]
  }

}
