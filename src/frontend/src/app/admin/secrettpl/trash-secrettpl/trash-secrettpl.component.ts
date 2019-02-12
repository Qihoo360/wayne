import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { SecretTplService } from '../../../shared/client/v1/secrettpl.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-secrettpl',
  templateUrl: 'trash-secrettpl.component.html'
})
export class TrashSecretTplComponent implements OnInit, OnDestroy {
  secrettpls: SecretTpl[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private secrettplService: SecretTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_SECRET_TPL) {
        const secrettplId = message.data;
        this.secrettplService.deleteById(secrettplId, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('加密文件删除成功！');
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
    this.secrettplService.listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.secrettpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteSecrettpl(secrettpl: SecretTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除加密文件确认',
      '你确认永久删除加密文件' + secrettpl.name + ' ？删除后将不可恢复！',
      secrettpl.id,
      ConfirmationTargets.TRASH_SECRET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(secrettpl: SecretTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(secrettpl.template, false, '详情'));
  }

  recoverSecrettpl(secrettpl: SecretTpl) {
    secrettpl.deleted = false;
    this.secrettplService.update(secrettpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('加密文件恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
