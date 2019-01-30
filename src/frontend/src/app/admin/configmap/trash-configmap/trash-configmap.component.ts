import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { ConfigMapService } from '../../../shared/client/v1/configmap.service';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-configmap',
  templateUrl: 'trash-configmap.component.html'
})
export class TrashConfigMapComponent implements OnInit, OnDestroy {
  configMaps: ConfigMap[];
  pageState: PageState = new PageState();
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(
    private configMapService: ConfigMapService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService,
    private aceEditorService: AceEditorService
  ) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_CONFIGMAP) {
        const configMap = message.data;
        this.configMapService.deleteById(configMap.id, 0, false)
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
    this.configMapService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configMaps = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteConfigMap(configMap: ConfigMap) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置集确认',
      '你确认永久删除配置集 ' + configMap.name + ' ？删除后将不可恢复！',
      configMap,
      ConfirmationTargets.TRASH_CONFIGMAP,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverConfigMap(configMap: ConfigMap) {
    configMap.deleted = false;
    this.configMapService.update(configMap)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('配置集恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
