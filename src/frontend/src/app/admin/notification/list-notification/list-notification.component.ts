import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from 'wayne-component/lib/page/page-state';
import { Notification } from 'wayne-component/lib/model/v1/notification';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { NotificationService } from 'wayne-component/lib/client/v1/notification.service';
import { MessageHandlerService } from 'wayne-component';

@Component({
  selector: 'wayne-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss']
})
export class ListNotificationComponent implements OnInit {

  @Input() notifications: Notification[];
  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  notification: Notification = new Notification();
  notificationModal = false;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() updated = new EventEmitter<boolean>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificaionService: NotificationService,
    private messageHandlerService: MessageHandlerService,
  ) {
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  showPushNotifyModal(notify: Notification) {
    this.notification = notify;
    this.notificationModal = true;
  }

  pushNotify() {
    this.notificaionService.publish(this.notification.id).subscribe(
      next => {
        this.messageHandlerService.showSuccess('广播成功！');
        this.notificationModal = false;
        this.updated.emit(true);
      }, error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  cancelPushNotify() {
    this.notification = new Notification();
    this.notificationModal = false;
  }

}
