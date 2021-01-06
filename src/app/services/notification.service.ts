import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifierService: NotifierService) {
  }

  public showSuccessMessage(message: string): void {
    this.notifierService.notify("success", message);
  }

  public showErrorMessage(message: string): void {
    this.notifierService.notify("error", message);
  }

  public showWarningMessage(message: string): void {
    this.notifierService.notify("warning", message);
  }
}
