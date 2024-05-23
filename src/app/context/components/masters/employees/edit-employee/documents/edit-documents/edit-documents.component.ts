import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { FileProgressEvent, FileUpload, FileUploadErrorEvent, UploadEvent } from 'primeng/fileupload';
import { filter } from 'rxjs';
import { DocumentModel } from 'src/app/context/api/company/edit-employee.model';
import { CommonDataModel } from 'src/app/context/api/shared/common-data.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { CompanyService } from 'src/app/context/service/company.service';
import { EmployeeService } from 'src/app/context/service/employee.service';

@Component({
  selector: 'app-edit-documents',
  templateUrl: './edit-documents.component.html',
  styleUrls: ['./edit-documents.component.scss']
})
export class EditDocumentsComponent implements OnInit {

  selectedDocument: DocumentModel = new DocumentModel();
  dependents: any[];
  docTypes: CommonDataModel[] = [];
  isSaving: boolean;
  @Output() loadDocs: EventEmitter<boolean> = new EventEmitter(false);
  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  uploadedFiles: any[] = [];
  @Input()
  get selectedDoc(): DocumentModel {
    return this.selectedDocument;
  };
  set selectedDoc(value: DocumentModel) {
    this.selectedDocument = value;
    this.selectedDocument.expiryDate = value.expiryDate != null ? new Date(value.expiryDate) : null;
    this.selectedDocument.issueDate = value.issueDate != null ? new Date(value.issueDate) : null;
    this.selectedDocument.markAsOldDate = value.markAsOldDate != null ? new Date(value.markAsOldDate) : null;
    this.setReminderDate();
    this.onChangeDependent();
  }

  constructor(private http: HttpClient, private baseService: BaseService, private alert: AlertService,
    private employeeService: EmployeeService, private route: ActivatedRoute, private config: PrimeNGConfig,
    private confirm: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.getDependents();
  }

  getDependents() {
    // this.spinner.show()
    const empId = Number(this.route.snapshot?.parent?.paramMap.get('id'));
    this.employeeService.getDependents(empId).subscribe({
      next: res => {
        this.dependents = res;
        this.dependents.push({ code: 0, dependentName: '--Employee--' })
        // this.spinner.hide()
      }
    })
  }

  get isAttachmentsAvailable() {
    return this.selectedDocument && (this.selectedDocument.attachmentOne != '' || this.selectedDocument.attachmentTwo != '' ||
      this.selectedDocument.attachmentThree != '')
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    // this.removeAttachment(index)
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear,) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event, uploader: FileUpload) {
    this.files = event.currentFiles;
    let availableSlots = 0;

    if (this.selectedDocument.attachmentOne == '') {
      availableSlots = availableSlots + 1;
    }
    if (this.selectedDocument.attachmentTwo == '') {
      availableSlots = availableSlots + 1;
    }
    if (this.selectedDocument.attachmentThree == '') {
      availableSlots = availableSlots + 1;
    }
    this.files.forEach((file, index) => {
      if ((index + 1) > availableSlots) {
        uploader.remove(event, index);
        this.alert.warn('Only 3 files can be attach to a document. Please delete one of the files and try again.');
        return;
      }
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback) {
    callback();
  }

  choose(event, callback) {
    debugger;
    callback();
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  onChangeDependent() {
    // this.spinner.show();
    this.employeeService.getDocTypes(1, this.selectedDocument.dependentCode != 0).subscribe({
      next: res => {
        // this.spinner.hide();
        this.docTypes = res;
      }
    })
  }

  onSubmit(form: NgForm) {
    form.form.markAllAsTouched();
    // this.validateModel(form);
    // this.spinner.show();

    if (form.form.valid) {
      this.isSaving = true;
      let doc = this.selectedDocument;
      const user = this.baseService.userDetails$.getValue();
      const empId = Number(this.route.snapshot?.parent?.paramMap.get('id'));
      doc.employeeId = empId;
      doc.loggedUser = user.id;
      doc.companyId = user.companyId;
      this.employeeService.saveOrUpdateDocuments(doc).subscribe({
        next: res => {
          this.alert.success('Document info updated.');
          // this.spinner.hide();
          this.isSaving = false;
          this.loadDocs.emit(true);
          // this.modalService.dismissAll();
        },
        error: err => {
          this.alert.error(err);
          // this.spinner.hide();
          this.isSaving = false;
        }
      })
    } else {
      // this.alert.error('hello')
    }
  }

  validateModel(form: NgForm) {
    if (form.control.get('dependentCode')?.invalid) { this.alert.showError('Linked to required.'); }
    if (form.control.get('docTypeId')?.invalid) { this.alert.showError('Document type required.'); }
    if (form.control.get('name')?.invalid) { this.alert.showError('Document name required.'); }
    if (form.control.get('docNo')?.invalid) { this.alert.showError('Document number required.'); }

    if (form.control.get('expiryDate')?.invalid) { this.alert.showError('Expiry date required.'); }
    if (form.control.get('markAsOldDate')?.invalid) { this.alert.showError('Mark as old date required.'); }
  }

  onModelChange(form: NgForm) {
    if (this.selectedDocument.remindMe) {
      form.control.get('expiryDate')?.addValidators([Validators.required]);
      // form.control.get('remindBefore')?.addValidators([Validators.required]);
    } else {
      form.control.get('expiryDate')?.removeValidators(Validators.required);
      // form.control.get('remindBefore')?.removeValidators(Validators.required);
      this.selectedDocument.expiryDate = null;
    }
    if (form.control.get('markAsOld').value) {
      form.control.get('markAsOldDate')?.addValidators([Validators.required]);
    } else {
      form.control.get('markAsOldDate')?.removeValidators(Validators.required);
      this.selectedDocument.markAsOldDate = null;
    }
    form.control.get('expiryDate')?.updateValueAndValidity();
    form.control.get('expiryDate')?.markAsTouched();
    form.control.get('markAsOldDate')?.updateValueAndValidity();
    form.control.get('markAsOldDate')?.markAsTouched();
    // form.control.get('remindBefore')?.updateValueAndValidity();
    // form.control.get('remindBefore')?.markAsTouched();
  }

  getDocumentIconByUrl(url: string) {
    return url.includes('.pdf') ? 'pi pi-file-pdf' : 'pi pi-image';
  }

  onChangeDocType() {
    let selectedType = this.docTypes.find(a => a.id == this.selectedDocument.docTypeId);
    this.selectedDocument.name = selectedType?.name
  }

  setReminderDate() {
    if (this.selectedDocument.remindMe) {
      if (this.selectedDocument.expiryDate != null) {
        const remindMeBefore = this.selectedDocument.remindBefore == '' ? 0 : this.selectedDocument.remindBefore;
        const dateString = this.selectedDocument.expiryDate.toLocaleDateString();
        const dateObj = new Date(dateString)
        var dateOffset = (24 * 60 * 60 * 1000) * remindMeBefore;
        let remindOn = new Date(dateObj.setTime(dateObj.getTime() - dateOffset));
        this.selectedDocument.remindOn = remindOn.toLocaleDateString();
      }
      else {
        this.selectedDocument.remindBefore = 0;
        this.selectedDocument.remindOn = '';
      }
    } else {
      this.selectedDocument.remindBefore = 0;
      this.selectedDocument.remindOn = '';
    }
  }

  onUpload(event: UploadEvent, type: number = 0) {

    const ev = event.originalEvent as any;
    const urlList = ev.body.imgUrlList;
    urlList.forEach((url, index) => {
      let link = this.baseService.apiEndpoint + url;
      if (this.selectedDocument?.attachmentOne == '') {
        this.selectedDocument.attachmentOne = link;
        this.alert.info('Attachment uploaded');
      } else if (this.selectedDocument?.attachmentTwo == '') {
        this.selectedDocument.attachmentTwo = link;
        this.alert.info('Attachment uploaded');
      } else if (this.selectedDocument?.attachmentThree == '') {
        this.selectedDocument.attachmentThree = link;
        this.alert.info('Attachment uploaded');
      } else {
        this.alert.warn('Only 3 attachments are allowed. Please Delete one of the attachments and try again.' + index);
      }
    });
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

  customUpload(event) {
    // Loop through each file in the event.files array
    for (let file of event.files) {
      // Create a new FormData object
      const formData = new FormData();
      // Append the file to the FormData object
      formData.append('file', file, file.name);

      // Create a new HttpRequest object for the file upload
      const req = new HttpRequest('POST', 'https://localhost:44319/api/employee/upload-file?attachmentType=2', formData, {
        reportProgress: true
      });

      // Send the HttpRequest and subscribe to the response
      this.http.request(req).pipe(
        filter(e => e instanceof HttpResponse)
      ).subscribe(response => {
        console.log(response);
        // Handle the response from the server
      });
    }
  }

  onProgress(event: FileProgressEvent) {
    console.log(event.progress)
  }

  onError(event: FileUploadErrorEvent, type: number) {
    this.alert.error('Cannot attach the document.');
    switch (type) {
      // case 1: this.selectedDocument.attachmentOne = event?.error.er.toString(); break;
      // case 2: this.selectedDocument.attachmentTwo = event?.error?.error.toString(); break;
      // case 3: this.selectedDocument.attachmentThree = event?.error?.error.toString(); break;
    }
  }

  removeAttachment(type: number) {
    switch (type) {
      case 0: this.selectedDocument.attachmentOne = ''; break;
      case 1: this.selectedDocument.attachmentTwo = ''; break;
      case 2: this.selectedDocument.attachmentThree = ''; break;
    }
  }

  openAttachment(link: string) {
    window.open(link, '_blank');
  }

}
