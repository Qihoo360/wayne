import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Notification } from '../../../shared/model/v1/notification';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { NotificationService } from '../../../shared/client/v1/notification.service';

@Component({
  selector: 'wayne-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit {
  opened = false;
  notify: Notification = new Notification();
  @Output() create = new EventEmitter<boolean>();

  constructor(
    private notificationService: NotificationService,
    private messageHandlerService: MessageHandlerService,
  ) {
  }

  ngOnInit() {
  }

  newOrEditNotification() {
    this.opened = true;
    this.notify = new Notification();
  }

  cancelCreateNotification() {
    this.opened = false;
    this.notify = new Notification();
  }

  doCreateNotifycation() {
    this.notificationService.create(this.notify)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess(`创建通知成功！`);
          this.create.emit(true);
          this.opened = false;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  isValid(): boolean {
    return this.notify.title.length > 0;
  }

}
