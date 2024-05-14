import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DocumentModel } from 'src/app/context/api/company/edit-employee.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {

  documents: DocumentModel[] = [];
  docTypes: string[];
  selectedDoc: DocumentModel;
  sidebarVisible: boolean = false;
  showDeleteDialog: boolean = false;
  showDocumentSlide: boolean = false;
  deleteReason: string = '';

  constructor(private companyService: CompanyService, private baseService: BaseService, private alert: AlertService,
    private employeeService: EmployeeService, private route: ActivatedRoute,
    private confirm: ConfirmationService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDate(date: Date) {
    if (date) {
      return new Date(date)
    }
    return '';
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  getImagePath(path: string) {
    return this.baseService.apiEndpoint + path;
  }

  getRemindMeDate(doc: DocumentModel) {
    const dateString = new Date(doc.expiryDate).toLocaleDateString();
    const dateObj = new Date(dateString)
    var dateOffset = (24 * 60 * 60 * 1000) * doc.remindBefore;
    let remindOn = new Date(dateObj.setTime(dateObj.getTime() - dateOffset));
    console.log(remindOn)
    this.selectedDoc.remindOn = remindOn.toLocaleDateString();
  }

  onDelete(doc: DocumentModel) {
    this.showDeleteDialog = true;
    this.selectedDoc = doc;
  }

  onClickDelete() {
    if (this.deleteReason == '') {
      this.alert.showError('Enter delete reason.')
      return;
    }
    // this.spinner.show();
    const user = this.baseService.userDetails$.getValue();
    this.employeeService.deleteDocument(user.id, this.selectedDoc.id, this.deleteReason).subscribe({
      next: res => {
        this.alert.success('Document Deleted.');
        // this.spinner.hide();
        this.getDocuments();
      },
      error: err => {
        this.alert.error(err);
        // this.spinner.hide();
      }
    })
  }

  getDocuments(event: any = undefined) {
    // this.spinner.show();
    const empId = Number(this.route.snapshot?.parent?.paramMap.get('id'))
    this.employeeService.getDocuments(empId).subscribe({
      next: res => {
        this.documents = res.map(e => { return { ...e, expiryDate: e.expiryDate == null ? undefined : new Date(<Date>e.expiryDate) } });
        this.docTypes = Object.keys(this.groupBy(res, 'docType')).map((e => { return e }));
        // this.spinner.hide();
      }
    })
  }

  openDocumentModel(doc: any = undefined) {
    // this.modalService.open(content, { fullscreen: true, size: 'lg', backdrop: 'static', backdropClass: 'model-backdrop' });
    if (doc == undefined) {
      this.selectedDoc = new DocumentModel();
    } else {
      this.selectedDoc = doc;
    }
  }

  groupBy(array: any[], key: any) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      ; (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      )
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result
    }, {}) // empty object is the initial value for result object
  }

}
