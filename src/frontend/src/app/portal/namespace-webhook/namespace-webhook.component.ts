import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs/Subscription';
import { ListNamespaceWebHookComponent } from './list-namespace-webhook/list-namespace-webhook.component';
import { CreateEditNamespaceWebHookComponent } from './create-edit-namespace-webhook/create-edit-namespace-webhook.component';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { WebHook } from '../../shared/model/v1/webhook';
import { WebHookService } from '../../shared/client/v1/webhook.service';
import { AuthService } from '../../shared/auth/auth.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PageState } from '../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';

const showState = {
  'ID': {hidden: true},
  'name': {hidden: false},
  'URL': {hidden: false},
  'status': {hidden: false},
  'create_user': {hidden: false},
  'create_time': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-namespace-webhook.content-container',
  templateUrl: './namespace-webhook.component.html',
  styleUrls: ['./namespace-webhook.component.scss']
})
export class NamespaceWebHookComponent implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceWebHookComponent, { static: false })
  listWebHook: ListNamespaceWebHookComponent;
  @ViewChild(CreateEditNamespaceWebHookComponent, { static: false })
  createEditWebHook: CreateEditNamespaceWebHookComponent;
  showList: any[] = new Array();
  showState: object = showState;
  pageState: PageState = new PageState();
  webHooks: WebHook[];
  resourceLabel = 'Webhook';

  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              public authService: AuthService,
              private contextService: CacheService,
              private webHookService: WebHookService,
              private messageHandlerService: MessageHandlerService,
              public translate: TranslateService,
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
    this.pageState.filters['scope'] = 0;
    this.webHookService.query(this.pageState, 0, this.contextService.namespaceId)
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
      '确认删除 ' + this.resourceLabel + ':' + webHook.name + '?',
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
