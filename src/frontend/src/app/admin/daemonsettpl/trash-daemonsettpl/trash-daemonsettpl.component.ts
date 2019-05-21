import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { PageState } from 'wayne-component/lib/page/page-state';
import { DaemonSetTplService } from 'wayne-component/lib/client/v1/daemonsettpl.service';
import { DaemonSetTemplate } from 'wayne-component/lib/model/v1/daemonsettpl';

@Component({
  selector: 'trash-daemonsettpl',
  templateUrl: 'trash-daemonsettpl.component.html'
})
export class TrashDaemonsettplComponent implements OnInit, OnDestroy {

  daemonsetTpls: DaemonSetTemplate[];
  pageState: PageState = new PageState();
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private daemonsetTplService: DaemonSetTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_DAEMONSET_TPL) {
        const id = message.data;
        this.daemonsetTplService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('守护进程集模版删除成功！');
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
    this.daemonsetTplService
      .listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.daemonsetTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteDaemonsetTpl(template: DaemonSetTemplate) {
    const deletionMessage = new ConfirmationMessage(
      '删除守护进程集模版确认',
      '你确认永久删除守护进程集模版 ' + template.name + ' ？删除后将不可恢复！',
      template.id,
      ConfirmationTargets.TRASH_DAEMONSET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  detailMateDataTpl(template: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(template, false, '元数据查看'));
  }

  recoverDaemonsetTpl(template: DaemonSetTemplate) {
    template.deleted = false;
    this.daemonsetTplService.update(template, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('守护进程集模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
