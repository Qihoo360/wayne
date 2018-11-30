import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListDeploymentTplComponent } from './list-deploymenttpl/list-deploymenttpl.component';
import { CreateEditDeploymentTplComponent } from './create-edit-deploymenttpl/create-edit-deploymenttpl.component';
import { DeploymentTpl } from '../../shared/model/v1/deploymenttpl';
import { DeploymentTplService } from '../../shared/client/v1/deploymenttpl.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-deploymenttpl',
  templateUrl: './deploymenttpl.component.html',
  styleUrls: ['./deploymenttpl.component.scss']
})
export class DeploymentTplComponent implements OnInit {

  @ViewChild(ListDeploymentTplComponent)
  listDeployment: ListDeploymentTplComponent;
  @ViewChild(CreateEditDeploymentTplComponent)
  createEditDeployment: CreateEditDeploymentTplComponent;
  pageState: PageState = new PageState();
  deploymentId: string;
  changedDeployments: DeploymentTpl[];

  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private deploymentTplService: DeploymentTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/deployment/tpl', '部署模板列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/deployment/tpl/trash', '已删除部署模板列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DEPLOYMENT_TPL) {
        let id = message.data;
        this.deploymentTplService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('部署模版删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.deploymentId = params['did'];
      if (typeof (this.deploymentId) == 'undefined') {
        this.deploymentId = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    this.deploymentTplService.listPage(this.pageState, 0, this.deploymentId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedDeployments = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createDeployment(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditDeployment.newOrEditDeploymentTpl();
  }

  deleteDeployment(tpl: DeploymentTpl) {
    let deletionMessage = new ConfirmationMessage(
      '删除部署模版确认',
      '你确认删除部署模版 ' + tpl.name + ' ？',
      tpl.id,
      ConfirmationTargets.DEPLOYMENT_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editDeployment(tpl: DeploymentTpl) {
    this.createEditDeployment.newOrEditDeploymentTpl(tpl.id);
  }

}
