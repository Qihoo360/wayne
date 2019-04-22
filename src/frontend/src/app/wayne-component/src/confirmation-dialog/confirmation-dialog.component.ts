import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ConfirmationMessage } from './confirmation-message';
import { ConfirmationAcknowledgement } from './confirmation-state-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../shared.const';

@Component({
  selector: 'confiramtion-dialog',
  templateUrl: 'confirmation-dialog.component.html',
  styleUrls: ['confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnDestroy {
  opened = false;
  dialogTitle = '';
  dialogContent = '';
  message: ConfirmationMessage;
  annouceSubscription: Subscription;
  buttons: ConfirmationButtons;

  constructor(
    private confirmationService: ConfirmationDialogService) {
    this.annouceSubscription = confirmationService.confirmationAnnouced$.subscribe(msg => {
      this.dialogTitle = msg.title;
      this.dialogContent = msg.message;
      this.message = msg;
      // Open dialog
      this.buttons = msg.buttons;
      this.open();
    });
  }

  ngOnDestroy(): void {
    if (this.annouceSubscription) {
      this.annouceSubscription.unsubscribe();
    }
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  cancel(): void {
    if (!this.message) {// Inproper condition
      this.close();
      return;
    }

    const data: any = this.message.data ? this.message.data : {};
    const target = this.message.target ? this.message.target : ConfirmationTargets.EMPTY;
    this.confirmationService.cancel(new ConfirmationAcknowledgement(
      ConfirmationState.CANCEL,
      data,
      target
    ));
    this.close();
  }

  confirm(): void {
    if (!this.message) {// Inproper condition
      this.close();
      return;
    }

    const data: any = this.message.data ? this.message.data : {};
    const target = this.message.target ? this.message.target : ConfirmationTargets.EMPTY;
    this.confirmationService.confirm(new ConfirmationAcknowledgement(
      ConfirmationState.CONFIRMED,
      data,
      target
    ));
    this.close();
  }
}
