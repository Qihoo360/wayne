import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { DeploymentTpl } from '../../../shared/model/v1/deploymenttpl';
import { DeploymentTplService } from '../../../shared/client/v1/deploymenttpl.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-deploymenttpl',
  templateUrl: 'trash-deploymenttpl.component.html'
})
export class TrashDeploymentTplComponent implements OnInit, OnDestroy {

  deploymentTpls: DeploymentTpl[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private deploymentTplService: DeploymentTplService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_DEPLOYMENT_TPL) {
        const id = message.data;
        this.deploymentTplService.deleteById(id, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('部署模版删除成功！');
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
      this.pageState = PageState.fromState(state, {
        pageSize: 10,
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.pageState.params['deleted'] = true;
    this.deploymentTplService
      .listPage(this.pageState, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.deploymentTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteDeploymentTpl(deploymentTpl: DeploymentTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除部署模版确认',
      '你确认永久删除部署模版 ' + deploymentTpl.name + ' ？删除后将不可恢复！',
      deploymentTpl.id,
      ConfirmationTargets.TRASH_DEPLOYMENT_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  tplDetail(deploymentTpl: DeploymentTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(deploymentTpl.template, false, '详情'));
  }

  recoverDeploymentTpl(deploymentTpl: DeploymentTpl) {
    deploymentTpl.deleted = false;
    this.deploymentTplService.update(deploymentTpl, 0)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('部署模版恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
