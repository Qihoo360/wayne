import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from 'wayne-component';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourceStatefulSet,
  ResourcesActionType,
  TemplateState
} from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PublishStatefulsetTplComponent } from '../publish-tpl/publish-tpl.component';
import { ListEventComponent } from 'wayne-component/lib/list-event/list-event.component';
import { ListPodComponent } from 'wayne-component/lib/list-pod/list-pod.component';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'wayne-component/lib/page/page-state';
import { StatefulsetTemplate } from 'wayne-component/lib/model/v1/statefulsettpl';
import { StatefulsetService } from 'wayne-component/lib/client/v1/statefulset.service';
import { StatefulsetTplService } from 'wayne-component/lib/client/v1/statefulsettpl.service';
import { Event } from 'wayne-component/lib/model/v1/event';
import { TemplateStatus } from 'wayne-component/lib/model/v1/status';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { TranslateService } from '@ngx-translate/core';
import { DiffService } from 'wayne-component/lib/diff/diff.service';

@Component({
  selector: 'list-statefulset',
  templateUrl: 'list-statefulset.component.html',
  styleUrls: ['list-statefulset.scss']
})
export class ListStatefulsetComponent implements OnInit, OnDestroy {
  selected: StatefulsetTemplate[] = [];
  @Input() showState: object;
  @Input() statefulsetTpls: StatefulsetTemplate[];
  @Input() page: Page;
  @Input() appId: number;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() cloneTpl = new EventEmitter<StatefulsetTemplate>();
  @Output() createTpl = new EventEmitter<boolean>();

  @ViewChild(ListPodComponent)
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventComponent)
  listEventComponent: ListEventComponent;
  @ViewChild(PublishStatefulsetTplComponent)
  publishStatefulsetTpl: PublishStatefulsetTplComponent;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;

  constructor(private statefulsetService: StatefulsetService,
              private deletionDialogService: ConfirmationDialogService,
              private statefulsetTplService: StatefulsetTplService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              public authService: AuthService,
              private diffService: DiffService,
              private tplDetailService: TplDetailService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.STATEFULSET_TPL) {
        const tplId = message.data;
        this.statefulsetTplService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('状态副本集模版删除成功！');
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

  cloneStatefulsetTpl(tpl: StatefulsetTemplate) {
    this.cloneTpl.emit(tpl);
  }

  deleteStatefulsetTpl(tpl: StatefulsetTemplate): void {
    const deletionMessage = new ConfirmationMessage(
      '删除状态副本集模版确认',
      `你确认删除状态副本集模版${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.STATEFULSET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  statefulsetTplDetail(tpl: StatefulsetTemplate): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  tplDetail(tpl: StatefulsetTemplate) {
    this.tplDetailService.openModal(tpl.description);
  }

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, '版本');
  }

  publishTpl(tpl: StatefulsetTemplate) {
    this.statefulsetService.getById(tpl.statefulsetId, this.appId).subscribe(
      status => {
        const statefulset = status.data;
        this.publishStatefulsetTpl.newPublishTpl(statefulset, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  offlineStatefulset(tpl: StatefulsetTemplate) {
    this.statefulsetService.getById(tpl.statefulsetId, this.appId).subscribe(
      status => {
        const statefulset = status.data;
        this.publishStatefulsetTpl.newPublishTpl(statefulset, tpl, ResourcesActionType.OFFLINE);
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

  listPod(status: TemplateStatus, tpl: StatefulsetTemplate) {
    if (status.cluster && status.state !== TemplateState.NOT_FOUND) {
      this.listPodComponent.openModal(status.cluster, tpl.name, KubeResourceStatefulSet);
    }
  }

}
