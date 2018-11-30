import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from '@clr/angular';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-persistentvolumeclaim',
  templateUrl: 'trash-persistentvolumeclaim.component.html'
})
export class TrashPersistentVolumeClaimComponent implements OnInit, OnDestroy {

  pvcs: PersistentVolumeClaim[];
  pageState: PageState = new PageState();
  currentPage: number = 1;
  state: State;

  subscription: Subscription;

  constructor(private pvcService: PersistentVolumeClaimService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_PERSISTENT_VOLUME_CLAIM) {
        let id = message.data;
        this.pvcService.deleteById(id, 0, false)
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

  refresh(state?: State) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pvcService.list(this.pageState, 'true')
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.pvcs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deletePvc(pvc: PersistentVolumeClaim) {
    let deletionMessage = new ConfirmationMessage(
      '删除PVC确认',
      '你确认永久删除PVC ' + pvc.name + ' ？删除后将不可恢复！',
      pvc.id,
      ConfirmationTargets.TRASH_PERSISTENT_VOLUME_CLAIM,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverPvc(pvc: PersistentVolumeClaim) {
    pvc.deleted = false;
    this.pvcService
      .update(pvc)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('PVC恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
