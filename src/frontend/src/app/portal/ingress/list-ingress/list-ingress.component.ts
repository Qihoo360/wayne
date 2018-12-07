import { OnInit, Component, OnDestroy, AfterContentInit, ViewChild, ElementRef, Output, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@clr/angular';
import { Ingress } from '../../../shared/model/v1/ingress';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { Page } from '../../../shared/page/page-state';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressTplService } from '../../../shared/client/v1/ingresstpl.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { PublishIngressTplComponent } from '../publish-tpl/publish-tpl.component';
import { IngressStatusComponent } from '../status/status.component';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  ResourcesActionType,
  TemplateState
} from '../../../shared/shared.const';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';


@Component({
  selector: 'list-ingress',
  templateUrl: 'list-ingress.component.html',
  styleUrls: ['list-ingress.scss']
})
export class ListIngressComponent implements OnInit, OnDestroy {
  @Input() showState: object;
  @ViewChild(PublishIngressTplComponent)
  publishTpl: PublishIngressTplComponent;
  @ViewChild(IngressStatusComponent)
  ingressStatus: IngressStatusComponent;

  @Input() ingresses: Ingress[];
  @Input() ingressTpls: IngressTpl[];
  @Input() page: Page;
  @Input() appId: number;
  state: State;
  currentPage = 1;

  @Output() paginate = new EventEmitter<State>();
  @Output() serviceTab = new EventEmitter<number>();
  @Output() cloneTpl = new EventEmitter<IngressTpl>();
  subscription: Subscription;

  constructor(private ingressTplService: IngressTplService,
              private ingressService: IngressService,
              private tplDetailService: TplDetailService,
              private messageHandlerService: MessageHandlerService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              public authService: AuthService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.INGRESS_TPL) {
        const tplId = message.data;
        this.ingressTplService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('Ingress 模版删除成功！');
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
    this.paginate.emit(this.state);
  }

  cloneIngressTpl(tpl: IngressTpl) {
    this.cloneTpl.emit(tpl);
  }

  viewIngressTpl(tpl: IngressTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  tplDetail(tpl: IngressTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  publishIngressTpl(tpl: IngressTpl) {
    this.ingressService.getById(tpl.ingressId, this.appId).subscribe(
      response => {
        const ingress = response.data;
        this.publishTpl.newPublishTpl(ingress, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  ingressState(status: PublishStatus, tpl: IngressTpl) {
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.ingressStatus.newIngressStatus(status.cluster, tpl);
    }

  }

  offlineIngressTpl(tpl: IngressTpl) {
    this.ingressService.getById(tpl.ingressId, this.appId).subscribe(
      response => {
        const ingress = response.data;
        this.publishTpl.newPublishTpl(ingress, tpl, ResourcesActionType.OFFLINE);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  deleteIngressTpl(tpl: IngressTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除 Ingress 模版确认',
      `你确认删除 Ingress 模版 ${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.INGRESS_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  refresh(state?: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  published(success: boolean) {
    if (success) {
      this.refresh();
    }
  }

}
