import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../global-message/message.service';
import { AlertType, httpStatusCode } from '../shared.const';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class MessageHandlerService {

  constructor(private msgService: MessageService,
              private injector: Injector,
              @Inject(DOCUMENT) private document: any) {
  }

  public handleError(err: any | string): void {
    if (!err) {
      return;
    }
    const code = err.statusCode || err.status;
    console.log(err);
    if (code === httpStatusCode.Unauthorized) {
      const currentUrl = document.location.origin;
      if (document.location.pathname !== '/sign-in') {
        this.injector.get(Router).navigateByUrl(`sign-in?ref=${document.location.pathname}`);
      }
    } else {
      this.msgService.announceMessage(code, err.error ? err.error.msg : err.error, AlertType.DANGER);
    }
  }


  public showError(message: string): void {
    if (message && message.trim() !== '') {
      this.msgService.announceMessage(500, message, AlertType.DANGER);
    }
  }

  public showSuccess(message: string): void {
    if (message && message.trim() !== '') {
      this.msgService.announceMessage(200, message, AlertType.SUCCESS);
    }
  }

  public showInfo(message: string): void {
    if (message && message.trim() !== '') {
      this.msgService.announceMessage(200, message, AlertType.INFO);
    }
  }

  public showWarning(message: string): void {
    if (message && message.trim() !== '') {
      this.msgService.announceMessage(400, message, AlertType.WARNING);
    }
  }

  public clear(): void {
    this.msgService.clear();
  }

  public error(error: any): void {
    this.showError(error);
  }


  public warning(warning: any): void {
    this.showWarning(warning);
  }

  public info(info: any): void {
    this.showSuccess(info);
  }

  public log(log: any): void {
    this.showInfo(log);
  }
}
