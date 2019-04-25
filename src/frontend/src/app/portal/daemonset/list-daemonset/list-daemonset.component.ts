import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourceDaemonSet,
  ResourcesActionType,
  TemplateState
} from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PublishDaemonSetTplComponent } from '../publish-tpl/publish-tpl.component';
import { ListEventComponent } from 'wayne-component/lib/list-event/list-event.component';
import { ListPodComponent } from 'wayne-component/lib/list-pod/list-pod.component';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'wayne-component/lib/page/page-state';
import { Event } from 'wayne-component/lib/model/v1/event';
import { TemplateStatus } from 'wayne-component/lib/model/v1/status';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { DaemonSetTemplate } from 'wayne-component/lib/model/v1/daemonsettpl';
import { DaemonSetService } from 'wayne-component/lib/client/v1/daemonset.service';
import { DaemonSetTplService } from 'wayne-component/lib/client/v1/daemonsettpl.service';
import { DiffService } from 'wayne-component/lib/diff/diff.service';

@Component({
  selector: 'list-daemonset',
  templateUrl: 'list-daemonset.component.html',
  styleUrls: ['list-daemonset.scss']
})
export class ListDaemonSetComponent implements OnInit, OnDestroy {
  selected: DaemonSetTemplate[] = [];
  @Input() showState: object;
  @Input() daemonSetTpls: DaemonSetTemplate[];
  @Input() page: Page;
  @Input() appId: number;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() cloneTpl = new EventEmitter<DaemonSetTemplate>();
  @Output() createTpl = new EventEmitter<boolean>();

  @ViewChild(ListPodComponent)
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventComponent)
  listEventComponent: ListEventComponent;
  @ViewChild(PublishDaemonSetTplComponent)
  publishDaemonSetTpl: PublishDaemonSetTplComponent;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private daemonSetService: DaemonSetService,
              private deletionDialogService: ConfirmationDialogService,
              private daemonSetTplService: DaemonSetTplService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              private diffService: DiffService,
              public authService: AuthService,
              private tplDetailService: TplDetailService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET_TPL) {
        const tplId = message.data;
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

  diffTpl() {
    this.diffService.diff(this.selected);
  }


  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  cloneDaemonSetTpl(tpl: DaemonSetTemplate) {
    this.cloneTpl.emit(tpl);
  }

  deleteDaemonSetTpl(tpl: DaemonSetTemplate): void {
    const deletionMessage = new ConfirmationMessage(
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
        const daemonSet = status.data;
        this.publishDaemonSetTpl.newPublishTpl(daemonSet, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  offlineDaemonSet(tpl: DaemonSetTemplate) {
    this.daemonSetService.getById(tpl.daemonSetId, this.appId).subscribe(
      status => {
        const daemonSet = status.data;
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
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.listPodComponent.openModal(status.cluster, tpl.name, KubeResourceDaemonSet);
    }
  }

}
