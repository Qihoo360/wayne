import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared.const';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../page/page-state';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';

export class TrashResourceComponent implements OnInit, OnDestroy {

  resources: any[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(public resourceService: any,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService,
              public aceEditorService: AceEditorService,
              public resourceType: string,
              public confirmationTarget: ConfirmationTargets) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === confirmationTarget) {
        const id = message.data;
        this.resourceService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(`${resourceType} 删除成功！`);
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
    this.resourceService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.resources = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteResource(resource: any) {
    const deletionMessage = new ConfirmationMessage(
      `删除 ${this.resourceType} 确认`,
      `你确认永久删除 ${this.resourceType} ` + resource.name + ' ？删除后将不可恢复！',
      resource.id,
      this.confirmationTarget,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverResource(resource: any) {
    resource.deleted = false;
    this.resourceService
      .update(resource)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess(`${this.resourceType} 恢复成功！`);
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  viewMetaDataTemplate(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
