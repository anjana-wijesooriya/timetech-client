import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastrService: ToastrService, private messageService: MessageService) { }

  showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  success(msg: string) {
    this.toastrService.success(msg, 'Success', { timeOut: 5000, closeButton: true, progressBar: true })
  }

  error(msg: any) {
    if (typeof (msg) == 'string') {
      this.toastrService.error(msg, 'Error', { timeOut: 5000, closeButton: true, progressBar: true })
    } else {
      if (msg.error.statusCode == 500) {
        this.toastrService.error(msg.error.description, 'Error', { timeOut: 5000, closeButton: true, progressBar: true })
      } else {
        this.toastrService.error(msg.error, 'Error', { timeOut: 5000, closeButton: true, progressBar: true })
      }
    }
  }
}
