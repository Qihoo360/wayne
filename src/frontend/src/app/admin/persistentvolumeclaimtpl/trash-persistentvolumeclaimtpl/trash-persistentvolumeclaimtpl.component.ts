import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PersistentVolumeClaimTplService } from '../../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-persistentvolumeclaimtpl',
  templateUrl: 'trash-persistentvolumeclaimtpl.component.html'
})
export class TrashPersistentVolumeClaimTplComponent implements OnInit, OnDestroy {

  pvcTpls: PersistentVolumeClaimTpl[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private pvcTplService: PersistentVolumeClaimTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_PERSISTENT_VOLUME_CLAIM_TPL) {
        const id = message.data;
        this.pvcTplService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('PVC删除成功！');
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
    this.pvcTplService.list(this.pageState, 0, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.pvcTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deletePvcTpl(tpl: PersistentVolumeClaimTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除PVC确认',
      '你确认永久删除PVC模版 ' + tpl.name + ' ？删除后将不可恢复！',
      tpl.id,
      ConfirmationTargets.TRASH_PERSISTENT_VOLUME_CLAIM_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(tpl: PersistentVolumeClaimTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl.template, false, '详情'));
  }

  recoverPvcTpl(tpl: PersistentVolumeClaimTpl) {
    tpl.deleted = false;
    this.pvcTplService.update(tpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('PVC模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
