import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  KubeResourcePersistentVolumeClaim,
  PublishType,
  ResourcesActionType,
  syncStatusInterval,
  TemplateState
} from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { PersistentVolumeClaimTplService } from '../../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { PublishPersistentVolumeClaimTplComponent } from '../publish-tpl/publish-tpl.component';
import { CacheService } from '../../../shared/auth/cache.service';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { ActivatedRoute, Router } from '@angular/router';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { combineLatest } from 'rxjs';
import { PageState } from '../../../shared/page/page-state';
import { PublishService } from '../../../shared/client/v1/publish.service';
import { isArrayEmpty, isArrayNotEmpty } from '../../../shared/utils';
import { UserInfoComponent } from '../user-info/user-info.component';
import { PersistentVolumeClaimFileSystemStatus } from '../../../shared/model/v1/persistentvolumeclaim';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PersistentVolumeClaimRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims-robin';
import { DiffService } from '../../../shared/diff/diff.service';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'list-persistentvolumeclaim',
  templateUrl: 'list-persistentvolumeclaim.component.html',
  styleUrls: ['list-persistentvolumeclaim.scss']
})
export class ListPersistentVolumeClaimComponent implements OnInit, OnDestroy {
  selected: PersistentVolumeClaimTpl[] = [];
  @ViewChild(PublishPersistentVolumeClaimTplComponent, { static: false })
  publishTpl: PublishPersistentVolumeClaimTplComponent;
  @ViewChild(UserInfoComponent, { static: false })
  userInfoComponent: UserInfoComponent;
  appId: number;
  pvcId: number;
  state: ClrDatagridStateInterface;
  currentPage = 1;
  pageState: PageState = new PageState();
  isOnline = false;
  loading: boolean;
  pvcTpls: PersistentVolumeClaimTpl[];
  publishStatus: PublishStatus[];
  tplStatusMap = {};

  timer: any = null;
  @Output() cloneTpl = new EventEmitter<PersistentVolumeClaimTpl>();
  diffscription: Subscription;
  subscription: Subscription;
  isOnlineObservable: Subscription;

  componentName = 'PVC';
  leave = false;

  constructor(private pvcTplService: PersistentVolumeClaimTplService,
              private tplDetailService: TplDetailService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              private publishService: PublishService,
              private appService: AppService,
              private diffService: DiffService,
              private pvcService: PersistentVolumeClaimService,
              private kubernetesClient: KubernetesClient,
              private persistentVolumeClaimRobinClient: PersistentVolumeClaimRobinClient,
              public cacheService: CacheService,
              private messageHandlerService: MessageHandlerService,
              public authService: AuthService,
              private deletionDialogService: ConfirmationDialogService) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_TPL) {
        const tplId = message.data;
        this.pvcTplService.deleteById(tplId, this.appId)
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
    this.periodSyncStatus();
    this.diffscription = pvcService.diffOb.subscribe(() => {
      this.diffService.diff(this.selected);
    });
  }

  get isEnableRobin(): boolean {
    return this.authService.config['enableRobin'];
  }

  periodSyncStatus() {
    this.timer = setInterval(() => {
      this.syncStatus();
    }, syncStatusInterval);
  }

  syncStatus(): void {
    if (this.pvcTpls && this.pvcTpls.length > 0) {
      for (let i = 0; i < this.pvcTpls.length; i++) {
        const tpl = this.pvcTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            this.kubernetesClient.get(status.cluster, KubeResourcePersistentVolumeClaim, tpl.name,
              this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.pvcTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }

                const pvc = response.data;
                this.pvcTpls[i].status[j].pvc = pvc;
                if (response.data &&
                  this.pvcTpls &&
                  this.pvcTpls[i] &&
                  this.pvcTpls[i].status &&
                  this.pvcTpls[i].status[j] &&
                  pvc.status.phase === 'Bound') {
                  this.pvcTpls[i].status[j].state = TemplateState.SUCCESS;
                } else {
                  this.pvcTpls[i].status[j].state = TemplateState.FAILD;
                }
                if (this.isEnableRobin) {
                  this.pvcFileSystemStatus(this.pvcTpls[i].status[j]);
                }
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      }
    }
  }


  pvcFileSystemStatus(publishStatus: PublishStatus) {
    if (publishStatus.state === TemplateState.SUCCESS) {
      this.persistentVolumeClaimRobinClient.getStatus(this.appId,
        publishStatus.cluster, publishStatus.pvc.metadata.namespace, publishStatus.pvc.metadata.name).subscribe(
        response => {
          publishStatus.fileSystemStatus = response.data;
          publishStatus.rbdImage = response.data.rbdImage;
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
    }
  }

  fileSystemState(fileSystemStatus: PersistentVolumeClaimFileSystemStatus) {
    const status = Array<string>();
    if (fileSystemStatus) {
      if (isArrayNotEmpty(fileSystemStatus.status)) {
        for (const state of fileSystemStatus.status) {
          if (state === 'Mount') {
            status.push('已激活');
          }
          if (state === 'LoginForbidden') {
            status.push('禁止登录');
          }
          if (state === 'Verifying') {
            status.push('校验中');
          }
          if (state === 'VerifyOk') {
            status.push('校验成功');
          }
          if (state === 'VerifyFailed') {
            status.push('校验失败');
          }
        }
      }
      if (isArrayEmpty(status)) {
        status.push('未激活');
      }
    }

    return status;
  }

  activedFileSystem(fileSystemStatus: PersistentVolumeClaimFileSystemStatus) {
    if (fileSystemStatus) {
      if (isArrayNotEmpty(fileSystemStatus.status)) {
        for (const state of fileSystemStatus.status) {
          if (state === 'Mount') {
            return true;
          }
        }
      }
    }
    return false;
  }

  containState(fileSystemStatus: PersistentVolumeClaimFileSystemStatus, state: string) {
    if (fileSystemStatus) {
      if (isArrayNotEmpty(fileSystemStatus.status)) {
        for (const fstate of fileSystemStatus.status) {
          if (fstate === state) {
            return true;
          }
        }
      }
    }
    return false;
  }

  activePv(status: PublishStatus) {
    this.loading = true;
    this.persistentVolumeClaimRobinClient.activeRbdImage(this.appId, status.cluster,
      status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
      response => {
        this.syncStatus();
        this.messageHandlerService.showSuccess('激活成功！');
        this.loading = false;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  inActivePv(status: PublishStatus) {
    this.loading = true;
    this.persistentVolumeClaimRobinClient.inActiveRbdImage(this.appId, status.cluster,
      status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
      response => {
        this.syncStatus();
        this.messageHandlerService.showSuccess('取消激活成功！');
        this.loading = false;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  offlineImageUser(status: PublishStatus) {
    this.loading = true;
    this.persistentVolumeClaimRobinClient.offlineRbdImageUser(this.appId, status.cluster,
      status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
      response => {
        this.syncStatus();
        this.messageHandlerService.showSuccess('下线所有用户成功！');
        this.loading = false;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


  loginInfo(status: PublishStatus) {
    this.persistentVolumeClaimRobinClient.loginInfo(this.appId, status.cluster,
      status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
      response => {
        this.userInfoComponent.openModal(response.data);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


  verifyFileSystem(status: PublishStatus) {
    this.loading = true;
    this.persistentVolumeClaimRobinClient.verify(this.appId, status.cluster,
      status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
      response => {
        this.messageHandlerService.showSuccess('发送校验请求成功！');
        this.loading = false;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.leave = true;
    this.diffscription.unsubscribe();
    this.isOnlineObservable.unsubscribe();
    clearInterval(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.parent.parent.snapshot.params['id'], 10);
    this.pvcId = parseInt(this.route.parent.snapshot.params['pvcId'], 10);
    this.isOnlineObservable = this.pvcTplService.isOnlineObservable$.subscribe(
      isOnline => {
        this.isOnline = isOnline;
        this.refresh();
      }
    );
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  tplDetail(tpl: PersistentVolumeClaimTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  clonePvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.router.navigate([
      `portal/namespace/${this.cacheService.namespaceId}/app/${this.appId}/persistentvolumeclaim/${this.pvcId}/tpl/${tpl.id}`]);
  }

  detailPvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  publishPvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.PUBLISH);
  }

  offlinePvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.OFFLINE);
  }

  deletePvcTpl(tpl: PersistentVolumeClaimTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '模版确认',
      `你确认删除` + this.componentName + `${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['pvcId'] = this.pvcId;
    this.pageState.params['deleted'] = false;
    this.pageState.params['isOnline'] = this.isOnline;
    this.pageState.sort.by = 'id';
    this.pageState.sort.reverse = true;
    combineLatest(
      [this.pvcTplService.listPage(this.pageState, this.appId),
      this.publishService.listStatus(PublishType.PERSISTENT_VOLUME_CLAIM, this.pvcId)]
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tplStatusMap = {};
        if (status && status.length > 0) {
          for (const stat of status) {
            if (!tplStatusMap[stat.templateId]) {
              tplStatusMap[stat.templateId] = Array<PublishStatus>();
            }
            tplStatusMap[stat.templateId].push(stat);
          }
        }
        this.tplStatusMap = tplStatusMap;

        const tpls = response[0].data;
        this.buildTplList(tpls.list);
        this.pvcTpls = tpls.list;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        setTimeout(() => {
          if (this.leave) {
            return;
          }
          this.syncStatus();
        });
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  buildTplList(pvcTpls: PersistentVolumeClaimTpl[]) {
    if (pvcTpls) {
      for (const tpl of pvcTpls) {
        const metaData = tpl.metaData ? tpl.metaData : '{}';
        tpl.clusters = JSON.parse(metaData).clusters;

        const publishStatus = this.tplStatusMap[tpl.id];
        if (publishStatus && publishStatus.length > 0) {
          tpl.status = publishStatus;
        }
      }
    }
  }

  published(success: boolean) {
    if (success) {
      this.refresh();
    }
  }
}
