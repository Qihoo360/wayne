import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourceDeployment,
  ResourcesActionType,
  TemplateState
} from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PublishDeploymentTplComponent } from '../publish-tpl/publish-tpl.component';
import { ListEventComponent } from '../../../shared/list-event/list-event.component';
import { ListPodComponent } from '../../../shared/list-pod/list-pod.component';
import { DeploymentStatus, DeploymentTpl, Event } from '../../../shared/model/v1/deploymenttpl';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { DeploymentTplService } from '../../../shared/client/v1/deploymenttpl.service';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { TranslateService } from '@ngx-translate/core';
import { DiffService } from '../../../shared/diff/diff.service';

@Component({
  selector: 'list-deployment',
  templateUrl: 'list-deployment.component.html',
  styleUrls: ['list-deployment.scss']
})
export class ListDeploymentComponent implements OnInit, OnDestroy {
  selected: DeploymentTpl[] = [];
  @Input() showState: object;
  @Input() deploymentTpls: DeploymentTpl[];
  @Input() page: Page;
  @Input() appId: number;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() cloneTpl = new EventEmitter<DeploymentTpl>();
  @Output() createTpl = new EventEmitter<boolean>();

  @ViewChild(ListPodComponent, { static: false })
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventComponent, { static: false })
  listEventComponent: ListEventComponent;
  @ViewChild(PublishDeploymentTplComponent, { static: false })
  publishDeploymentTpl: PublishDeploymentTplComponent;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private deploymentService: DeploymentService,
              private deletionDialogService: ConfirmationDialogService,
              private deploymentTplService: DeploymentTplService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              public authService: AuthService,
              private tplDetailService: TplDetailService,
              private translate: TranslateService,
              private diffService: DiffService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DEPLOYMENT_TPL) {
        const tplId = message.data;
        this.deploymentTplService.deleteById(tplId, this.appId)
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

  /**
   * diff template
   */
  diffTpl() {
    this.diffService.diff(this.selected);
  }

  // --------------------------------

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(this.state);
  }

  cloneDeploymentTpl(tpl: DeploymentTpl) {
    this.cloneTpl.emit(tpl);
  }

  deleteDeploymentTpl(tpl: DeploymentTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除部署模版确认',
      `你确认删除部署模版${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.DEPLOYMENT_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  deploymentTplDetail(tpl: DeploymentTpl): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  tplDetail(tpl: DeploymentTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, '版本');
  }

  publishTpl(tpl: DeploymentTpl) {
    this.deploymentService.getById(tpl.deploymentId, this.appId).subscribe(
      status => {
        const deployment = status.data;
        this.publishDeploymentTpl.newPublishTpl(deployment, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  restartDeployment(tpl: DeploymentTpl) {
    this.deploymentService.getById(tpl.deploymentId, this.appId).subscribe(
      status => {
        const deployment = status.data;
        this.publishDeploymentTpl.newPublishTpl(deployment, tpl, ResourcesActionType.RESTART);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  offlineDeployment(tpl: DeploymentTpl) {
    this.deploymentService.getById(tpl.deploymentId, this.appId).subscribe(
      status => {
        const deployment = status.data;
        this.publishDeploymentTpl.newPublishTpl(deployment, tpl, ResourcesActionType.OFFLINE);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  modifyReplicas(tpl: DeploymentTpl) {
    this.deploymentService.getById(tpl.deploymentId, this.appId).subscribe(
      status => {
        const deployment = status.data;
        this.publishDeploymentTpl.newPublishTpl(deployment, tpl, ResourcesActionType.MODIFY_REPLICA);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  published(success: boolean) {
    if (success) {
      this.refresh();
    }
  }

  listEvent(warnings: Event[]) {
    if (warnings) {
      this.listEventComponent.openModal(warnings);
    }
  }

  listPod(status: DeploymentStatus, tpl: DeploymentTpl) {
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.listPodComponent.openModal(status.cluster, tpl.name, KubeResourceDeployment);
    }
  }

}
