import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PageState } from '../../../shared/page/page-state';
import { StatefulsetTplService } from '../../../shared/client/v1/statefulsettpl.service';
import { StatefulsetTemplate } from '../../../shared/model/v1/statefulsettpl';

@Component({
  selector: 'trash-statefulsettpl',
  templateUrl: 'trash-statefulsettpl.component.html'
})
export class TrashStatefulsettplComponent implements OnInit, OnDestroy {

  statefulsetTpls: StatefulsetTemplate[];
  pageState: PageState = new PageState();
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private statefulsetTplService: StatefulsetTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_STATEFULSET_TPL) {
        const id = message.data;
        this.statefulsetTplService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('状态副本集模版删除成功！');
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
    this.statefulsetTplService
      .listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.statefulsetTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteStatefulsetTpl(template: StatefulsetTemplate) {
    const deletionMessage = new ConfirmationMessage(
      '删除状态副本集模版确认',
      '你确认永久删除状态副本集模版 ' + template.name + ' ？删除后将不可恢复！',
      template.id,
      ConfirmationTargets.TRASH_STATEFULSET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(template: StatefulsetTemplate) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(template.template, false, '详情'));
  }

  recoverStatefulsetTpl(template: StatefulsetTemplate) {
    template.deleted = false;
    this.statefulsetTplService.update(template, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('状态副本集模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
