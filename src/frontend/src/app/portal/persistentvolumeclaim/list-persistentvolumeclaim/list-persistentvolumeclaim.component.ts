import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  PublishType,
  ResourcesActionType,
  syncStatusInterval,
  TemplateState
} from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { TplDetailService } from '../../common/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { PersistentVolumeClaimTplService } from '../../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { PublishPersistentVolumeClaimTplComponent } from '../publish-tpl/publish-tpl.component';
import { PersistentVolumeClaimClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims';
import { CacheService } from '../../../shared/auth/cache.service';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { ActivatedRoute, Router } from '@angular/router';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { Observable } from 'rxjs/Observable';
import { PageState } from '../../../shared/page/page-state';
import { PublishService } from '../../../shared/client/v1/publish.service';
import { isArrayEmpty, isArrayNotEmpty } from '../../../shared/utils';
import { UserInfoComponent } from '../user-info/user-info.component';
import { PersistentVolumeClaimFileSystemStatus } from '../../../shared/model/v1/persistentvolumeclaim';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PersistentVolumeClaimRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims-robin';

@Component({
  selector: 'list-persistentvolumeclaim',
  templateUrl: 'list-persistentvolumeclaim.component.html',
  styleUrls: ['list-persistentvolumeclaim.scss']
})
export class ListPersistentVolumeClaimComponent implements OnInit, OnDestroy {
  @ViewChild(PublishPersistentVolumeClaimTplComponent)
  publishTpl: PublishPersistentVolumeClaimTplComponent;
  @ViewChild(UserInfoComponent)
  userInfoComponent: UserInfoComponent;
  appId: number;
  pvcId: number;
  state: State;
  currentPage: number = 1;
  pageState: PageState = new PageState();
  isOnline: boolean = false;
  loading: boolean;
  pvcTpls: PersistentVolumeClaimTpl[];
  publishStatus: PublishStatus[];
  tplStatusMap = {};

  timer: any = null;
  @Output() cloneTpl = new EventEmitter<PersistentVolumeClaimTpl>();
  subscription: Subscription;
  isOnlineObservable: Subscription;

  componentName: string = 'PVC';

  constructor(private pvcTplService: PersistentVolumeClaimTplService,
              private tplDetailService: TplDetailService,
              private route: ActivatedRoute,
              private aceEditorService: AceEditorService,
              private router: Router,
              private publishService: PublishService,
              private appService: AppService,
              private pvcService: PersistentVolumeClaimService,
              private pvcClient: PersistentVolumeClaimClient,
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
        let tplId = message.data;
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
        let tpl = this.pvcTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            let status = tpl.status[j];
            this.pvcClient.get(this.appId, status.cluster, this.cacheService.kubeNamespace, tpl.name).subscribe(
              response => {
                let code = response.statusCode | response.status;
                if (code === httpStatusCode.NoContent) {
                  this.pvcTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }

                let pvc = response.data;
                this.pvcTpls[i].status[j].pvc = pvc;
                if (response.data &&
                  this.pvcTpls &&
                  this.pvcTpls[i] &&
                  this.pvcTpls[i].status &&
                  this.pvcTpls[i].status[j] &&
                  pvc.status.phase == 'Bound') {
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
    if (publishStatus.state == TemplateState.SUCCESS) {
      this.persistentVolumeClaimRobinClient.getStatus(this.appId, publishStatus.cluster, publishStatus.pvc.metadata.namespace, publishStatus.pvc.metadata.name).subscribe(
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
    let status = Array<string>();
    if (fileSystemStatus) {
      if (isArrayNotEmpty(fileSystemStatus.status)) {
        for (let state of fileSystemStatus.status) {
          if (state == 'Mount') {
            status.push('已激活');
          }
          if (state == 'LoginForbidden') {
            status.push('禁止登录');
          }
          if (state == 'Verifying') {
            status.push('校验中');
          }
          if (state == 'VerifyOk') {
            status.push('校验成功');
          }
          if (state == 'VerifyFailed') {
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
        for (let state of fileSystemStatus.status) {
          if (state == 'Mount') {
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
        for (let fstate of fileSystemStatus.status) {
          if (fstate == state) {
            return true;
          }
        }
      }
    }
    return false;
  }

  activePv(status: PublishStatus) {
    this.loading = true;
    this.persistentVolumeClaimRobinClient.activeRbdImage(this.appId, status.cluster, status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
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
    this.persistentVolumeClaimRobinClient.inActiveRbdImage(this.appId, status.cluster, status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
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
    this.persistentVolumeClaimRobinClient.offlineRbdImageUser(this.appId, status.cluster, status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
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
    this.persistentVolumeClaimRobinClient.loginInfo(this.appId, status.cluster, status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
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
    this.persistentVolumeClaimRobinClient.verify(this.appId, status.cluster, status.pvc.metadata.namespace, status.pvc.metadata.name).subscribe(
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
    this.isOnlineObservable.unsubscribe();
    clearInterval(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.parent.parent.snapshot.params['id']);
    this.pvcId = parseInt(this.route.parent.snapshot.params['pvcId']);
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
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.appId}/persistentvolumeclaim/${this.pvcId}/tpl/${tpl.id}`]);
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
    let deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '模版确认',
      `你确认删除` + this.componentName + `${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  refresh(state?: State) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['pvcId'] = this.pvcId;
    this.pageState.params['deleted'] = false;
    this.pageState.params['isOnline'] = this.isOnline;
    this.pageState.sort.by = 'id';
    this.pageState.sort.reverse = true;
    Observable.combineLatest(
      this.pvcTplService.listPage(this.pageState, this.appId),
      this.publishService.listStatus(PublishType.PERSISTENT_VOLUME_CLAIM, this.pvcId)
    ).subscribe(
      response => {
        let status = response[1].data;
        this.publishStatus = status;
        let tplStatusMap = {};
        if (status && status.length > 0) {
          for (let state of status) {
            if (!tplStatusMap[state.templateId]) {
              tplStatusMap[state.templateId] = Array<PublishStatus>();
            }
            tplStatusMap[state.templateId].push(state);
          }
        }
        this.tplStatusMap = tplStatusMap;

        let tpls = response[0].data;
        this.buildTplList(tpls.list);
        this.pvcTpls = tpls.list;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.syncStatus();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  buildTplList(pvcTpls: PersistentVolumeClaimTpl[]) {
    if (pvcTpls) {
      for (let tpl of pvcTpls) {
        let metaData = tpl.metaData ? tpl.metaData : '{}';
        tpl.clusters = JSON.parse(metaData).clusters;

        let publishStatus = this.tplStatusMap[tpl.id];
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
