import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { IngressTpl } from 'wayne-component/lib/model/v1/ingresstpl';
import { IngressTplService } from 'wayne-component/lib/client/v1/ingresstpl.service';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { PageState } from 'wayne-component/lib/page/page-state';

@Component({
  selector: 'trash-ingresstpl',
  templateUrl: 'trash-ingresstpl.component.html'
})
export class TrashIngressTplComponent implements OnInit, OnDestroy {

  ingressTpls: IngressTpl[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private ingressTplService: IngressTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_INGRESS_TPL) {
        const id = message.data;
        this.ingressTplService
          .deleteById(id, 0, false)
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
    this.pageState.params['deleted'] = true;
    this.ingressTplService.listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.ingressTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteTemplate(ingressTpl: IngressTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除 Ingress 模板确认',
      '你确认永久删除 Ingress 模版 ' + ingressTpl.name + ' ？删除后将不可恢复！',
      ingressTpl.id,
      ConfirmationTargets.TRASH_INGRESS_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(ingressTpl: IngressTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(ingressTpl.template, false, '详情'));
  }

  recoverTemplate(ingressTpl: IngressTpl) {
    ingressTpl.deleted = false;
    this.ingressTplService.update(ingressTpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('Ingress 模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
