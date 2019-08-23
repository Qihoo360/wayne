import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListDeploymentComponent } from './list-deployment/list-deployment.component';
import { CreateEditDeploymentComponent } from './create-edit-deployment/create-edit-deployment.component';
import { Deployment } from '../../shared/model/v1/deployment';
import { DeploymentService } from '../../shared/client/v1/deployment.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit, OnDestroy {

  @ViewChild(ListDeploymentComponent, { static: false })
  listDeployment: ListDeploymentComponent;
  @ViewChild(CreateEditDeploymentComponent, { static: false })
  createEditDeployment: CreateEditDeploymentComponent;

  pageState: PageState = new PageState();
  appId: string;
  changedDeployments: Deployment[];

  subscription: Subscription;

  constructor(
    private deploymentService: DeploymentService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService
  ) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DEPLOYMENT) {
        const deploymentId = message.data;
        this.deploymentService.deleteById(deploymentId, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('部署删除成功！');
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
      this.appId = params['aid'];
      if (typeof (this.appId) === 'undefined') {
        this.appId = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.deploymentService.list(this.pageState, 'false', this.appId).subscribe(
      response => {
        const data = response.data;
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
    this.createEditDeployment.newOrEditDeployment();
  }

  deleteDeployment(deployment: Deployment) {
    const deletionMessage = new ConfirmationMessage(
      '删除部署确认',
      '你确认删除部署 ' + deployment.name + ' ？',
      deployment.id,
      ConfirmationTargets.DEPLOYMENT,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editDeployment(deployment: Deployment) {
    this.createEditDeployment.newOrEditDeployment(deployment.id);
  }

}
