import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Deployment } from '../../../shared/model/v1/deployment';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { PageState } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'trash-deployment',
  templateUrl: 'trash-deployment.component.html'
})
export class TrashDeploymentComponent implements OnInit, OnDestroy {

  deployments: Deployment[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private deploymentService: DeploymentService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService,
              private aceEditorService: AceEditorService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_DEPLOYMENT) {
        const deploymentId = message.data;
        this.deploymentService.deleteById(deploymentId, 0, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('部署删除成功！');
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
    this.deploymentService.list(this.pageState, 'true')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.deployments = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteDeployment(deployment: Deployment) {
    const deletionMessage = new ConfirmationMessage(
      '删除部署确认',
      '你确认永久删除部署 ' + deployment.name + ' ？删除后将不可恢复！',
      deployment.id,
      ConfirmationTargets.TRASH_DEPLOYMENT,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverDeployment(deployment: Deployment) {
    deployment.deleted = false;
    this.deploymentService
      .update(deployment)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('部署恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
