import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TplDetailService } from '../../tpl-detail/tpl-detail.service';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { AuthService } from '../../auth/auth.service';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { Page } from '../../page/page-state';
import { EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourcesName,
  ResourcesActionType,
  TemplateState
} from '../../shared.const';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import { AceEditorMsg } from '../../ace-editor/ace-editor';
import { PublishStatus } from '../../model/v1/publish-status';
import { DiffService } from '../../diff/diff.service';

export class ListResource {
  publishTemplateComponent: any;
  resourceStatusComponent: any;

  @Input() showState: object;
  @Input() resources: any[];
  @Input() templates: any[];
  @Input() page: Page;
  @Input() appId: number;
  @Input() resourceId: number;
  @Input() kubeResource: KubeResourcesName;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() serviceTab = new EventEmitter<number>();
  @Output() cloneTemplate = new EventEmitter<any>();

  subscription: Subscription;
  state: ClrDatagridStateInterface;
  currentPage = 1;
  confirmationTarget: ConfirmationTargets;

  selectedTemplate: any[] = [];

  constructor(public templateService: any,
              public resourceService: any,
              public tplDetailService: TplDetailService,
              public messageHandlerService: MessageHandlerService,
              public route: ActivatedRoute,
              public aceEditorService: AceEditorService,
              public router: Router,
              public diffService: DiffService,
              public authService: AuthService,
              public deletionDialogService: ConfirmationDialogService) {
  }

  registSubscription(confirmTarget: ConfirmationTargets, msg: string) {
    this.subscription = this.deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === confirmTarget) {
        const tplId = message.data;
        this.templateService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(msg);
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  registConfirmationTarget(confirmationTarget: ConfirmationTargets) {
    this.confirmationTarget = confirmationTarget;

  }

  // 监听删除模板的事件
  onDeleteTemplate(title: string, message: string, template: any): void {
    const deletionMessage = new ConfirmationMessage(
      title,
      message + template.name,
      template.id,
      this.confirmationTarget,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  // 监听页面长度更改
  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  // 监听克隆模板的事件
  oncloneTemplate(template: any) {
    this.cloneTemplate.emit(template);
  }

  // 监听查看模板的事件
  onViewTemplate(template: any) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(template.template), false));
  }

  // 监听查看模板描述
  onViewTemplateDescription(template: any) {
    this.tplDetailService.openModal(template.description);
  }

  // 监听发布资源模板的事件
  onPublishResourceTemplate(template: any) {
    this.resourceService.getById(this.resourceId, this.appId).subscribe(
      response => {
        this.publishTemplateComponent.newPublishTemplate(response.data, template, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  // 监听下线资源模板触发的事件
  onOfflineResourceTemplate(template: any) {
    this.resourceService.getById(this.resourceId, this.appId).subscribe(
      response => {
        this.publishTemplateComponent.newPublishTemplate(response.data, template, ResourcesActionType.OFFLINE);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  // 查看资源线上状态
  showResourceState(status: PublishStatus, tpl: any) {
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.resourceStatusComponent.newResourceStatus(status.cluster, tpl, this.kubeResource);
    }

  }

  // 监听发布事件
  onPublishEvent(success: boolean) {
    if (success) {
      this.refresh();
    }
  }

  // 监听对比模板的事件
  public onShowDiffEvent() {
    this.diffService.diff(this.selectedTemplate);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }
}
