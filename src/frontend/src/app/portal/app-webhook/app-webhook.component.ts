import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListAppWebHookComponent } from './list-app-webhook/list-app-webhook.component';
import { CreateEditAppWebHookComponent } from './create-edit-app-webhook/create-edit-app-webhook.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { WebHook } from '../../shared/model/v1/webhook';
import { WebHookService } from '../../shared/client/v1/webhook.service';
import { AuthService } from '../../shared/auth/auth.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PageState } from '../../shared/page/page-state';

const showState = {
  'name': {hidden: false},
  'url': {hidden: false},
  'start_status': {hidden: false},
  'create_user': {hidden: false},
  'create_time': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-app-webhook',
  templateUrl: './app-webhook.component.html',
  styleUrls: ['./app-webhook.component.scss']
})
export class AppWebHookComponent implements OnInit, OnDestroy {
  showList: any[] = new Array();
  showState: object = showState;
  @ViewChild(ListAppWebHookComponent, { static: false })
  listWebHook: ListAppWebHookComponent;
  @ViewChild(CreateEditAppWebHookComponent, { static: false })
  createEditWebHook: CreateEditAppWebHookComponent;

  pageState: PageState = new PageState();
  webHooks: WebHook[];
  resourceLabel = 'WebHook';

  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              public authService: AuthService,
              private contextService: CacheService,
              private webHookService: WebHookService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.WEBHOOK) {
        const webHook = message.data;
        this.webHookService.delete(webHook)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.resourceLabel + '删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit() {
    this.initShow();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) { this.showList.push(key); }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openModal(): void {
    this.createEditWebHook.createEditWebHook();
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.filters['scope'] = 1;
    this.webHookService.query(this.pageState, 1, this.contextService.appId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.webHooks = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  refresh(dirty: boolean) {
    if (dirty) {
      this.retrieve();
    }
  }

  deleteWebHook(webHook: WebHook) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.resourceLabel + '确认',
      '你确认删除 ' + this.resourceLabel + ':' + webHook.name + '?',
      webHook,
      ConfirmationTargets.WEBHOOK,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editWebHook(webHook: WebHook) {
    this.createEditWebHook.createEditWebHook(webHook);
  }

  toggleWebHook(webHook: WebHook) {
    webHook.enabled = !webHook.enabled;
    this.webHookService.update(webHook).subscribe(
      next => {
        this.messageHandlerService.showSuccess('切换成功');
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

}
