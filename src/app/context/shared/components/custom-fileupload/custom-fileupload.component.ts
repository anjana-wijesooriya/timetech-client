import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { Image } from 'primeng/image';
import { BaseService } from 'src/app/context/service/base.service';
import { EmployeeService } from 'src/app/context/service/employee.service';

@Component({
  selector: 'app-custom-fileupload',
  templateUrl: './custom-fileupload.component.html',
  styleUrl: './custom-fileupload.component.scss'
})
export class CustomFileuploadComponent implements OnInit {

  @ViewChild('fileUploader', { static: false }) fileUploader: FileUpload;
  @ViewChild('attachment1', { static: false }) image1: Image;
  @ViewChild('attachment2', { static: false }) image2: Image;
  @ViewChild('attachment3', { static: false }) image3: Image;

  constructor(private baseService: BaseService, private employeeService: EmployeeService,) { }

  ngOnInit(): void {

  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    // this.removeAttachment(index)
    // this.totalSize -= parseInt(this.formatSize(file.size));
    // this.totalSizePercent = this.totalSize / 10;
  }

  onUploadImage(event: UploadEvent) {
    let response = event.originalEvent as any;
    if (response?.body?.success && response?.body?.imgUrlList != '') {
      this.image1.src = response?.body?.imgUrlList;
      // this.ticket.controls.attachment1.patchValue(this.selectedTicket.documentPath);
      // this.selectedAttachment.documentPath = new Utils().getImageBlobUrl(response?.body?.url);
      // this.alert.info('File has been attached to the record.');
    } else {
      // this.uploadControl.setValue('');
      this.image1.src = '';
      this.fileUploader.clear();
    }
  }

  getDocumentIconByUrl(url: string) {
    return url.includes('.pdf') ? 'pi pi-file-pdf text-5xl' : 'pi pi-image text-5xl';
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
