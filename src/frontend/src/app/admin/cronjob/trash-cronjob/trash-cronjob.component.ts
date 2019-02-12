import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Cronjob } from '../../../shared/model/v1/cronjob';
import { CronjobService } from '../../../shared/client/v1/cronjob.service';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-cronjob',
  templateUrl: 'trash-cronjob.component.html'
})
export class TrashCronjobComponent implements OnInit, OnDestroy {

  cronjobs: Cronjob[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;
  componentName = '计划任务';

  constructor(
    private cronjobService: CronjobService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService,
    private aceEditorService: AceEditorService
  ) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_CRONJOB) {
        const id = message.data;
        this.cronjobService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '删除成功！');
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
    this.cronjobService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.cronjobs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteCronjob(cronjob: Cronjob) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认永久删除' + this.componentName + cronjob.name + ' ？删除后将不可恢复！',
      cronjob.id,
      ConfirmationTargets.TRASH_CRONJOB,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverCronjob(cronjob: Cronjob) {
    cronjob.deleted = false;
    this.cronjobService
      .update(cronjob)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess(this.componentName + '恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
