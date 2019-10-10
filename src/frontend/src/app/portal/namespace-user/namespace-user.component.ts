import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ListNamespaceUserComponent } from './list-namespace-user/list-namespace-user.component';
import { CreateEditNamespaceUserComponent } from './create-edit-namespace-user/create-edit-namespace-user.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { NamespaceUser } from '../../shared/model/v1/namespace-user';
import { AuthService } from '../../shared/auth/auth.service';
import { NamespaceUserService } from '../../shared/client/v1/namespace-user.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PageState } from '../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';

const showState = {
  'ID': {hidden: true},
  'name': {hidden: false},
  'namespace': {hidden: false},
  'group': {hidden: false},
  'create_time': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-namespace-user.content-container',
  templateUrl: './namespace-user.component.html',
  styleUrls: ['./namespace-user.component.scss']
})
export class NamespaceUserComponent implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceUserComponent, { static: false })
  listNamespaceUser: ListNamespaceUserComponent;
  @ViewChild(CreateEditNamespaceUserComponent, { static: false })
  createEditNamespaceUser: CreateEditNamespaceUserComponent;

  pageState: PageState = new PageState();
  resourceId: string;
  listType: string;
  parentType: string;
  showList: any[] = new Array();
  showState: object = showState;
  changedNamespaceUsers: NamespaceUser[];
  componentName = '命名空间用户';

  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              private namespaceUserService: NamespaceUserService,
              private messageHandlerService: MessageHandlerService,
              public authService: AuthService,
              private cacheService: CacheService,
              public translate: TranslateService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.NAMESPACE_USER) {
        const namespaceUser = message.data;
        this.namespaceUserService.deleteById(namespaceUser.id, namespaceUser.namespace.id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '删除成功！');
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
    this.resourceId = this.cacheService.namespaceId.toString();
    this.listType = 'namespace';
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

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.namespaceUserService.list(this.pageState, this.listType, this.resourceId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedNamespaceUsers = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createNamespaceUser(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    if (this.listType === 'namespace') {
      this.createEditNamespaceUser.newOrEditNamespaceUser(this.resourceId);
    }
  }

  deleteNamespaceUser(namespaceUser: NamespaceUser) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认删除 ' + this.componentName + namespaceUser.user.name + ' ？',
      namespaceUser,
      ConfirmationTargets.NAMESPACE_USER,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editNamespaceUser(namespaceUser: NamespaceUser) {
    this.createEditNamespaceUser.newOrEditNamespaceUser(namespaceUser.namespace.id.toString(), namespaceUser.id);
  }
}
