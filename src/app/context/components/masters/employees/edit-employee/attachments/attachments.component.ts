import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { Image } from 'primeng/image';
import { EmployeeAttachment } from 'src/app/context/api/company/employee-attachment.model';
import { AlertService } from 'src/app/context/service/alert.service';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';
import { BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';
import { Utils } from 'src/app/context/shared/utils';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.scss'
})
export class AttachmentsComponent implements OnInit {

  isSaving: boolean = false;
  showAddNewSlide: boolean = false;
  attachments: EmployeeAttachment[] = [];
  attachmentTypes: any[] = [];
  selectedAttachment: EmployeeAttachment = new EmployeeAttachment();
  showAddSlide: boolean = false;
  showInfoPane: boolean = false;
  showImageLodingError = false;
  imageError: boolean = false
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('fileUploader', { static: false }) fileUploader: FileUpload;
  @ViewChild('attachment', { static: false }) image: Image;

  uploadFormGroup = new FormGroup({
    file: new FormControl('', Validators.required)
  });
  uploadControl = new FormControl('', Validators.required);
  file: any
  isLoading: boolean = false;


  constructor(private breadcrumbState: BreadcrumbStateService, private baseService: BaseService, private alert: AlertService,
    private employeeService: EmployeeService, private route: ActivatedRoute,
    private confirm: ConfirmationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initBreadcrumbs();
    this.getAttachments();
    this.getAttachmentTypes();


  }

  private readonly breadcrumbConfig: { path: string | undefined, label: string, key: string, icon: string }[] = [
    { path: undefined, label: 'Master Modules', key: '1', icon: 'pi pi-share-alt' },
    { path: '/masters/employees', label: 'Employees', key: '2', icon: 'pi pi-chart-bar' },
    // { path: `/masters/employee/${this.route.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'pi pi-user-edit' },
    { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}`, label: 'Edit Employee', key: '3', icon: 'font-semibold ic i-Add-UserStar' },
    { path: `/masters/employees/${this.route.parent.snapshot.paramMap.get('id')}/attachments`, label: 'Attachments', key: '4', icon: 'font-semibold pi pi-paperclip' },

  ];

  initBreadcrumbs() {
    this.breadcrumbState.setBreadcrumbState([...this.breadcrumbConfig]);
  }

  getAttachments() {
    const empId = Number(this.route.snapshot?.parent?.paramMap.get('id'))
    this.employeeService.getEmployeeAttachments(empId).subscribe({
      next: res => {
        this.attachments = res.map(e => { return { ...e, attachedDt: e.attachedDt == null ? undefined : new Date(<Date>e.attachedDt) } });
        // this.spinner.hide();
      }
    })
  }

  getDocType(type: number) {
    return this.attachmentTypes.find(a => a.code == type)?.name;
  }

  onClickImage(event: any) {
    this.image.onPreviewImageClick = this.downloadAttachment.bind(this, this.selectedAttachment.documentPath);
  }

  getAttachmentTypes() {
    const customerId = this.baseService.userDetails$.getValue().customerId;
    this.employeeService.getEmployeeAttachmentTypes(customerId).subscribe({
      next: res => {
        this.attachmentTypes = res;
        // this.spinner.hide();
      }
    })
  }

  onUploadImage(event: UploadEvent) {
    let response = event.originalEvent as any;
    if (response?.body?.success && response?.body?.imgUrlList != '') {
      this.selectedAttachment.documentPath = response?.body?.imgUrlList;
      this.uploadControl.setValue(this.selectedAttachment.documentPath);
      // this.selectedAttachment.documentPath = new Utils().getImageBlobUrl(response?.body?.url);
      this.alert.info('File has been attached to the record.');
    } else {
      this.uploadControl.setValue('');
      this.selectedAttachment.documentPath = '';
      this.fileUploader.clear();
    }
  }

  onBeforeUpload(event: UploadEvent) {
    // this.selectedAttachment.documentPath = '';

  }

  uploadFile(event: any) {
    for (let file of event.files) {
      // this.form({ myFile: file });
      // this.form.get('myFile').updateValueAndValidity();
    }
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    // this.removeAttachment(index)
    // this.totalSize -= parseInt(this.formatSize(file.size));
    // this.totalSizePercent = this.totalSize / 10;
  }

  get isAttachmentsAvailable() {
    return this.selectedAttachment.documentPath != '' && this.selectedAttachment.documentPath != null;
  }

  onImageError(event: any) {
    // this.selectedAttachment.documentPath = '../../../../../assets/context/images/error/asset-error.svg';
    this.imageError = true;
  }

  getDocumentIconByUrl(url: string) {
    return url.includes('.pdf') ? 'pi pi-file-pdf text-5xl' : 'pi pi-image text-5xl';
  }

  onClickAddNew(item: any) {
    this.showAddSlide = !this.showAddSlide;
    // this.uploadControl.addControl('file', this.upload, { emitEvent: true });
  }

  onEdit(doc: EmployeeAttachment) {
    this.selectedAttachment = doc;
    this.showAddSlide = !this.showAddSlide;
  }

  onCloseAddPane() {
    this.selectedAttachment = new EmployeeAttachment();
    this.form.reset();
  }

  onSubmitAttachmentDetails(form: NgForm) {
    this.form.control.markAllAsTouched();
    this.uploadControl.markAsTouched();
    this.uploadControl.updateValueAndValidity();
    // this.form.control.addControl('file', 'file');
    const fileAttached = this.selectedAttachment.documentPath != '' && this.selectedAttachment.documentPath != null;
    if (this.form.valid && this.uploadControl.valid && fileAttached) {

      this.selectedAttachment.empId = Number(this.route.parent.snapshot.paramMap.get('id'));
      const userId = this.baseService.userDetails$.getValue().id;
      if (this.selectedAttachment.code == 0) {
        this.selectedAttachment.lastUpdatedUser = userId;
      } else {
        this.selectedAttachment.createdUser = userId;
      }
      this.isSaving = true;
      this.employeeService.saveEmployeeAttachment(userId, this.selectedAttachment).subscribe(res => {
        this.isSaving = false;
        this.getAttachments();
        this.showAddSlide = false;
        this.selectedAttachment = new EmployeeAttachment();
        this.form.reset();
        this.uploadControl.reset();
        this.fileUploader.clear();
      });
    }
  }

  deleteConfirm(event: Event, item: EmployeeAttachment) {

    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",

      accept: () => {
        this.isLoading = true;
        this.employeeService.deleteEmployeeAttachment(item.empId, item.code).subscribe(res => {
          this.alert.success('Record deleted');
          this.getAttachments();
        });
      },
      reject: () => {
        // this.alert.success('Record deleted');
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
}
