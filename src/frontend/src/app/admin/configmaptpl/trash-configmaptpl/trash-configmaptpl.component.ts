import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigMapTpl } from '../../../shared/model/v1/configmaptpl';
import { ConfigMapTplService } from '../../../shared/client/v1/configmaptpl.service';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-configmaptpl',
  templateUrl: 'trash-configmaptpl.component.html'
})
export class TrashConfigMapTplComponent implements OnInit, OnDestroy {

  configMapTpls: ConfigMapTpl[];
  pageState: PageState = new PageState();
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private configMapTplService: ConfigMapTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_CONFIGMAP_TPL) {
        const id = message.data;
        this.configMapTplService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置集删除成功！');
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
    this.configMapTplService.listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configMapTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteConfigMapTpl(configMapTpl: ConfigMapTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置集确认',
      '你确认永久删除配置集模版 ' + configMapTpl.name + ' ？删除后将不可恢复！',
      configMapTpl.id,
      ConfirmationTargets.TRASH_CONFIGMAP_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(configMapTpl: ConfigMapTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(configMapTpl.template, false, '详情'));
  }

  recoverConfigMapTpl(configMapTpl: ConfigMapTpl) {
    configMapTpl.deleted = false;
    this.configMapTplService.update(configMapTpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('配置集模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
