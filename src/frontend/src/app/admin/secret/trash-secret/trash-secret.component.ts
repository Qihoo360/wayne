import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Secret } from 'wayne-component/lib/model/v1/secret';
import { SecretService } from 'wayne-component/lib/client/v1/secret.service';
import { PageState } from 'wayne-component/lib/page/page-state';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';

@Component({
  selector: 'trash-secret',
  templateUrl: 'trash-secret.component.html'
})
export class TrashSecretComponent implements OnInit, OnDestroy {
  secrets: Secret[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private secretService: SecretService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_SECRET) {
        const secretId = message.data;
        this.secretService.deleteById(secretId, 0, false)
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
    this.secretService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.secrets = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteSecret(secret: Secret) {
    const deletionMessage = new ConfirmationMessage(
      '删除加密文件确认',
      '你确认永久删除加密文件' + secret.name + ' ？删除后将不可恢复！',
      secret.id,
      ConfirmationTargets.TRASH_SECRET,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverSecret(secret: Secret) {
    secret.deleted = false;
    this.secretService.update(secret)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('加密文件恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
