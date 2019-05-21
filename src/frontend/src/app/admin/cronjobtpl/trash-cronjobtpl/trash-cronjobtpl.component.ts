import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { CronjobTpl } from '../../../shared/model/v1/cronjobtpl';
import { CronjobTplService } from '../../../shared/client/v1/cronjobtpl.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-cronjobtpl',
  templateUrl: 'trash-cronjobtpl.component.html'
})
export class TrashCronjobTplComponent implements OnInit, OnDestroy {

  cronjobTpls: CronjobTpl[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  componentName = '计划任务模板';

  subscription: Subscription;

  constructor(private cronjobTplService: CronjobTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_CRONJOB_TPL) {
        const id = message.data;
        this.cronjobTplService.deleteById(id, 0, false)
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
    this.pageState.params['deleted'] = true;
    this.cronjobTplService.listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.cronjobTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteCronjobTpl(cronjobTpl: CronjobTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '确认',
      '你确认永久删除' + this.componentName + cronjobTpl.name + ' ？删除后将不可恢复！',
      cronjobTpl.id,
      ConfirmationTargets.TRASH_CRONJOB_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(cronjobTpl: CronjobTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(cronjobTpl.template, false, '详情'));
  }

  recoverCronjobTpl(cronjobTpl: CronjobTpl) {
    cronjobTpl.deleted = false;
    this.cronjobTplService.update(cronjobTpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess(this.componentName + '恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
