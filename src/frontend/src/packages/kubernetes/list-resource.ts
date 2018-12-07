import { ConfirmationDialogService } from '../../app/shared/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TplDetailService } from '../../app/shared/tpl-detail/tpl-detail.service';
import { AceEditorService } from '../../app/shared/ace-editor/ace-editor.service';
import { AuthService } from '../../app/shared/auth/auth.service';
import { MessageHandlerService } from '../../app/shared/message-handler/message-handler.service';
import { IngressTplService } from '../../app/shared/client/v1/ingresstpl.service';
import { IngressService } from '../../app/shared/client/v1/ingress.service';
import { Page } from '../../app/shared/page/page-state';
import { PublishIngressTplComponent } from '../../app/portal/ingress/publish-tpl/publish-tpl.component';
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IngressStatusComponent } from '../../app/portal/ingress/status/status.component';
import { Subscription } from 'rxjs/Subscription';
import { IngressTpl } from '../../app/shared/model/v1/ingresstpl';
import { Ingress } from '../../app/shared/model/v1/ingress';
import { State } from '@clr/angular';
import {
  ConfirmationButtons, ConfirmationState, ConfirmationTargets, ResourcesActionType,
  TemplateState
} from '../../app/shared/shared.const';
import { ConfirmationMessage } from '../../app/shared/confirmation-dialog/confirmation-message';
import { AceEditorMsg } from '../../app/shared/ace-editor/ace-editor';
import { PublishStatus } from '../../app/shared/model/v1/publish-status';

export class ListResource {
  publishTemplateComponent: any;
  resourceStatusComponent: any;

  @Input() showState: object;
  @Input() resources: any[];
  @Input() templates: any[];
  @Input() page: Page;
  @Input() appId: number;
  @Input() resourceId: number;

  @Output() paginate = new EventEmitter<State>();
  @Output() serviceTab = new EventEmitter<number>();
  @Output() cloneTemplate = new EventEmitter<any>();

  subscription: Subscription;
  state: State;
  currentPage = 1;
  confirmationTarget: ConfirmationTargets;

  constructor(public templateService: any,
              public resourceService: any,
              public tplDetailService: TplDetailService,
              public messageHandlerService: MessageHandlerService,
              public route: ActivatedRoute,
              public aceEditorService: AceEditorService,
              public router: Router,
              public authService: AuthService,
              public deletionDialogService: ConfirmationDialogService) {
    //
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

  onDeleteResourceTemplate(title: string, message: string, template: any ): void {
    const deletionMessage = new ConfirmationMessage(
      title,
      message +  template.name,
      template.id,
      this.confirmationTarget,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  oncloneTemplate(template: any) {
    this.cloneTemplate.emit(template);
  }

  onViewTemplate(template: any) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(template.template), false));
  }

  onViewTemplateDescription(template: any) {
    this.tplDetailService.openModal(template.description);
  }

  onPublishResourceTemplate(template: any) {
    this.resourceService.getById(this.resourceId, this.appId).subscribe(
      response => {
        this.publishTemplateComponent.newPublishTpl(response.data, template, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  onOfflineResourceTemplate(template: any) {
    this.resourceService.getById(this.resourceId, this.appId).subscribe(
      response => {
        this.publishTemplateComponent.newPublishTpl(response.data, template, ResourcesActionType.OFFLINE);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  showResourceState(status: PublishStatus, tpl: any) {
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.resourceStatusComponent.newIngressStatus(status.cluster, tpl);
    }

  }

  refresh(state?: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  onPublishEvent(success: boolean) {
    if (success) {
      this.refresh();
    }
  }
}
