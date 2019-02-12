import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Namespace } from '../../../shared/model/v1/namespace';
import { NamespaceService } from '../../../shared/client/v1/namespace.service';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-namespace',
  templateUrl: 'trash-namespace.component.html'
})
export class TrashNamespaceComponent implements OnInit, OnDestroy {
  namespaces: Namespace[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private namespaceService: NamespaceService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_NAMESPACE) {
        const namespaceId = message.data;
        this.namespaceService.deleteNamespace(namespaceId, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('空间删除成功！');
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.namespaceService.listNamespace(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.namespaces = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteNamespace(namespace: Namespace) {
    const deletionMessage = new ConfirmationMessage(
      '删除空间确认',
      '你确认永久删除空间' + namespace.name + ' ？删除后将不可恢复！',
      namespace.id,
      ConfirmationTargets.TRASH_NAMESPACE,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverNamespace(namespace: Namespace) {
    namespace.deleted = false;
    this.namespaceService.updateNamespace(namespace)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('空间恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
