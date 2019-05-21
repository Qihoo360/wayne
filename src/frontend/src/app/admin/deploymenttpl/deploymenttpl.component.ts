import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { ListDeploymentTplComponent } from './list-deploymenttpl/list-deploymenttpl.component';
import { CreateEditDeploymentTplComponent } from './create-edit-deploymenttpl/create-edit-deploymenttpl.component';
import { DeploymentTpl } from 'wayne-component/lib/model/v1/deploymenttpl';
import { DeploymentTplService } from 'wayne-component/lib/client/v1/deploymenttpl.service';
import { PageState } from 'wayne-component/lib/page/page-state';
import { isNotEmpty } from 'wayne-component/lib/utils';

@Component({
  selector: 'wayne-deploymenttpl',
  templateUrl: './deploymenttpl.component.html',
  styleUrls: ['./deploymenttpl.component.scss']
})
export class DeploymentTplComponent implements OnInit, OnDestroy {

  @ViewChild(ListDeploymentTplComponent)
  listDeployment: ListDeploymentTplComponent;
  @ViewChild(CreateEditDeploymentTplComponent)
  createEditDeployment: CreateEditDeploymentTplComponent;
  pageState: PageState = new PageState();
  deploymentId: string;
  changedDeployments: DeploymentTpl[];

  subscription: Subscription;

  constructor(
    private deploymentTplService: DeploymentTplService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DEPLOYMENT_TPL) {
        const id = message.data;
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
      if (typeof (this.deploymentId) === 'undefined') {
        this.deploymentId = '';
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
    this.pageState.params['deleted'] = false;
    if (this.route.snapshot.queryParams) {
      Object.getOwnPropertyNames(this.route.snapshot.queryParams).map(key => {
        const value = this.route.snapshot.queryParams[key];
        if (isNotEmpty(value)) {
          this.pageState.filters[key] = value;
        }
      });
    }
    this.deploymentTplService.listPage(this.pageState, 0, this.deploymentId)
      .subscribe(
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
    this.createEditDeployment.newOrEditDeploymentTpl();
  }

  deleteDeployment(tpl: DeploymentTpl) {
    const deletionMessage = new ConfirmationMessage(
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
