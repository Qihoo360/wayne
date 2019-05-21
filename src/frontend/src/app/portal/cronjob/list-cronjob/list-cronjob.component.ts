import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourceCronJob,
  ResourcesActionType,
} from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PublishCronjobTplComponent } from '../publish-tpl/publish-tpl.component';
import { CronjobStatus, CronjobTpl } from '../../../shared/model/v1/cronjobtpl';
import { CronjobService } from '../../../shared/client/v1/cronjob.service';
import { CronjobTplService } from '../../../shared/client/v1/cronjobtpl.service';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../shared/page/page-state';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { TranslateService } from '@ngx-translate/core';
import { DiffService } from '../../../shared/diff/diff.service';
import { ListJobComponent } from '../list-job/list-job.component';
import { KubeCronJob } from '../../../shared/model/v1/kubernetes/cronjob';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'list-cronjob',
  templateUrl: 'list-cronjob.component.html',
  styleUrls: ['list-cronjob.scss']
})
export class ListCronjobComponent implements OnInit, OnDestroy {
  @ViewChild(ListJobComponent)
  listJob: ListJobComponent;

  selected: CronjobTpl[] = [];
  @Input() showState: object;
  @Input() cronjobTpls: CronjobTpl[];
  @Input() page: Page;
  @Input() appId: number;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() cloneTpl = new EventEmitter<CronjobTpl>();
  @Output() createTpl = new EventEmitter<boolean>();

  @ViewChild(PublishCronjobTplComponent)
  publishCronjobTpl: PublishCronjobTplComponent;

  state: ClrDatagridStateInterface;
  currentPage = 1;

  subscription: Subscription;
  componentName = '计划任务';

  constructor(private cronjobService: CronjobService,
              private deletionDialogService: ConfirmationDialogService,
              private cronjobTplService: CronjobTplService,
              public authService: AuthService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              private diffService: DiffService,
              private tplDetailService: TplDetailService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CRONJOB_TPL) {
        const tplId = message.data;
        this.cronjobTplService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '模版删除成功！');
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  openJobModal(status: CronjobStatus, tpl: CronjobTpl) {
    this.listJob.openModal(status.cluster, status.kubeObj);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getActiveJobs(obj: KubeCronJob): number {
    if (!obj || !obj.status) {
      return 0;
    }
    return obj.status.active ? obj.status.active.length : 0;
  }

  diffTpl() {
    this.diffService.diff(this.selected);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  cloneCronjobTpl(tpl: CronjobTpl) {
    this.cloneTpl.emit(tpl);
  }

  deleteCronjobTpl(tpl: CronjobTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '模版确认',
      `你确认删除` + this.componentName + `模版${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.CRONJOB_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  cronjobTplDetail(tpl: CronjobTpl): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  tplDetail(tpl: CronjobTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, '版本');
  }

  publishTpl(tpl: CronjobTpl) {
    this.cronjobService.getById(tpl.cronjobId, this.appId).subscribe(
      status => {
        const cronjob = status.data;
        this.publishCronjobTpl.newPublishTpl(cronjob, tpl, ResourcesActionType.PUBLISH);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  suspend(tpl: CronjobTpl) {
    this.cronjobService.getById(tpl.cronjobId, this.appId).subscribe(
      status => {
        const cronjob = status.data;
        this.publishCronjobTpl.newPublishTpl(cronjob, tpl, ResourcesActionType.UPDATE);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  restartCronjob(tpl: CronjobTpl) {
    this.cronjobService.getById(tpl.cronjobId, this.appId).subscribe(
      status => {
        const cronjob = status.data;
        this.publishCronjobTpl.newPublishTpl(cronjob, tpl, ResourcesActionType.RESTART);
      },
      error => {
        this.messageHandlerService.handleError(error);
      });
  }

  offlineCronjobTpl(tpl: CronjobTpl) {
    this.cronjobService.getById(tpl.cronjobId, this.appId).subscribe(
      status => {
        const cronjob = status.data;
        this.publishCronjobTpl.newPublishTpl(cronjob, tpl, ResourcesActionType.OFFLINE);
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

  suspended(success: boolean) {
    if (success) {
      this.refresh();
    }
  }
}
