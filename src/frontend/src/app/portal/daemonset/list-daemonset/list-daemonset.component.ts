import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  ResourcesActionType,
  TemplateState
} from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PublishDaemonSetTplComponent } from '../publish-tpl/publish-tpl.component';
import { ListEventComponent } from '../list-event/list-event.component';
import { ListPodComponent } from '../list-pod/list-pod.component';
import { TplDetailService } from '../../common/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../shared/page/page-state';
import { Event } from '../../../shared/model/v1/event';
import { TemplateStatus } from '../../../shared/model/v1/status';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { DaemonSetTemplate } from '../../../shared/model/v1/daemonsettpl';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { DaemonSetTplService } from '../../../shared/client/v1/daemonsettpl.service';

@Component({
  selector: 'list-daemonset',
  templateUrl: 'list-daemonset.component.html',
  styleUrls: ['list-daemonset.scss']
})
export class ListDaemonSetComponent implements OnInit, OnDestroy {
  @Input() showState: object;
  @Input() daemonSetTpls: DaemonSetTemplate[];
  @Input() page: Page;
  @Input() appId: number;
  @Output() paginate = new EventEmitter<State>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() cloneTpl = new EventEmitter<DaemonSetTemplate>();
  @Output() createTpl = new EventEmitter<boolean>();

  @ViewChild(ListPodComponent)
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventComponent)
  listEventComponent: ListEventComponent;
  @ViewChild(PublishDaemonSetTplComponent)
  publishDaemonSetTpl: PublishDaemonSetTplComponent;
  state: State;
  currentPage: number = 1;

  subscription: Subscription;

  constructor(private daemonSetService: DaemonSetService,
              private deletionDialogService: ConfirmationDialogService,
              private daemonSetTplService: DaemonSetTplService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              public authService: AuthService,
              private tplDetailService: TplDetailService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET_TPL) {
        let tplId = message.data;
        this.daemonSetTplService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('守护进程集模版删除成功！');
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

  refresh(state?: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  cloneDaemonSetTpl(tpl: DaemonSetTemplate) {
    this.cloneTpl.emit(tpl);
  }

  deleteDaemonSetTpl(tpl: DaemonSetTemplate): void {
    let deletionMessage = new ConfirmationMessage(
      '删除守护进程集模版确认',
      `你确认删除守护进程集模版${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.DAEMONSET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  daemonSetTplDetail(tpl: DaemonSetTemplate): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  tplDetail(tpl: DaemonSetTemplate) {
    this.tplDetailService.openModal(tpl.description);
  }

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, '版本');
  }

  publishTpl(tpl: DaemonSetTemplate) {
    this.daemonSetService.getById(tpl.daemonSetId, this.appId).subscribe(
      status => {
        let daemonSet = status.data;
        this.publishDaemonSetTpl.newPublishTpl(daemonSet, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  offlineDaemonSet(tpl: DaemonSetTemplate) {
    this.daemonSetService.getById(tpl.daemonSetId, this.appId).subscribe(
      status => {
        let daemonSet = status.data;
        this.publishDaemonSetTpl.newPublishTpl(daemonSet, tpl, ResourcesActionType.OFFLINE);
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

  listPod(status: TemplateStatus, tpl: DaemonSetTemplate) {
    if (status.cluster && status.state != TemplateState.NOT_FOUND) {
      this.listPodComponent.openModal(status.cluster, tpl.name);
    }
  }

}
