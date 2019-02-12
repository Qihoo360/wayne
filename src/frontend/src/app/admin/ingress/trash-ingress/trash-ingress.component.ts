import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Ingress } from '../../../shared/model/v1/ingress';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-ingress',
  templateUrl: 'trash-ingress.component.html'
})
export class TrashIngressComponent implements OnInit, OnDestroy {

  ingresses: Ingress[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private ingressService: IngressService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_INGRESS) {
        const id = message.data;
        this.ingressService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('Ingress 删除成功！');
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
    this.ingressService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.ingresses = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteIngress(ingress: Ingress) {
    const deletionMessage = new ConfirmationMessage(
      '删除 Ingress 确认',
      '你确认永久删除 Ingress ' + ingress.name + ' ？删除后将不可恢复！',
      ingress.id,
      ConfirmationTargets.TRASH_INGRESS,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverIngress(ingress: Ingress) {
    ingress.deleted = false;
    this.ingressService
      .update(ingress)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('Ingress 恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
