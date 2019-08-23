import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../shared/client/v1/notification.service';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { AuthService } from '../../shared/auth/auth.service';
import { PageState } from '../../shared/page/page-state';
import { CacheService } from '../../shared/auth/cache.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Notification } from '../../shared/model/v1/notification';
import { CreateNotificationComponent } from './create-notification/create-notification.component';

@Component({
  selector: 'wayne-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @ViewChild(ListNotificationComponent, { static: false })
  listNotification: ListNotificationComponent;
  @ViewChild(CreateNotificationComponent, { static: false })
  createNotificationComponent: CreateNotificationComponent;

  pageState: PageState = new PageState();
  notifications: Notification[];
  resourceLabel = '通知';

  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              public authService: AuthService,
              private contextService: CacheService,
              private notificationService: NotificationService,
              private messageHandlerService: MessageHandlerService,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.filters['scope'] = 0;
    this.notificationService.query(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.notifications = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  refresh(dirty: boolean) {
    if (dirty) {
      this.retrieve();
    }
  }

  createNotification(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  updateNotification(updated: boolean) {
    if (updated) {
      this.retrieve();
    }
  }

  openCreateModal(): void {
    this.createNotificationComponent.newOrEditNotification();
  }

}
