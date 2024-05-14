import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private messageService: MessageService) { }

  showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  success(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  info(msg: string) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: msg });
  }

  warn(msg: string) {
    this.messageService.add({ severity: 'warning', summary: 'Warning', detail: msg });
  }

  error(msg: any) {
    if (typeof (msg) == 'string') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    } else {
      if (msg.error.statusCode == 500) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.error.description });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.error });
      }
    }
  }
}
