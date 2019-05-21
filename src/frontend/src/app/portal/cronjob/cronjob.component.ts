import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListCronjobComponent } from './list-cronjob/list-cronjob.component';
import { CreateEditCronjobComponent } from './create-edit-cronjob/create-edit-cronjob.component';
import { combineLatest } from 'rxjs';
import { ClrDatagridStateInterface } from '@clr/angular';
import { CronjobStatus, CronjobTpl } from '../../shared/model/v1/cronjobtpl';
import { App } from '../../shared/model/v1/app';
import { Cluster } from '../../shared/model/v1/cluster';
import { Cronjob } from '../../shared/model/v1/cronjob';
import { CronjobService } from '../../shared/client/v1/cronjob.service';
import { CronjobTplService } from '../../shared/client/v1/cronjobtpl.service';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { KubeCronJob } from '../../shared/model/v1/kubernetes/cronjob';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { JobClient } from '../../shared/client/v1/kubernetes/job';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { OrderItem } from '../../shared/model/v1/order';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  KubeResourceCronJob,
  PublishType,
  TemplateState
} from '../../shared/shared.const';
import { AuthService } from '../../shared/auth/auth.service';
import { PublishService } from '../../shared/client/v1/publish.service';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';
import { KubernetesClient } from '../../shared/client/v1/kubernetes/kubernetes';

const showState = {
  'create_time': {hidden: false},
  'version': {hidden: false},
  'online_cluster': {hidden: false},
  'scheduling_interval': {hidden: false},
  'release_explain': {hidden: false},
  'create_user': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-cronjob',
  templateUrl: './cronjob.component.html',
  styleUrls: ['./cronjob.component.scss']
})
export class CronjobComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild(ListCronjobComponent)
  listCronjob: ListCronjobComponent;

  @ViewChild(CreateEditCronjobComponent)
  createEditCronjob: CreateEditCronjobComponent;

  pageState: PageState = new PageState();
  isOnline = false;

  currentCronjob: Cronjob;
  changedCronjobTpls: CronjobTpl[];
  cronjobId: number;
  cronjobName: string;
  app: App;
  appId: number;
  clusters: Cluster[];
  cronjobs: Cronjob[];
  private timer: any = null;
  publishStatus: PublishStatus[];
  subscription: Subscription;
  componentName = '计划任务';
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  showList: any[] = new Array();
  showState: object = showState;

  constructor(private cronjobService: CronjobService,
              private publishHistoryService: PublishHistoryService,
              private cronjobTplService: CronjobTplService,
              private kubernetesClient: KubernetesClient,
              private jobClient: JobClient,
              private route: ActivatedRoute,
              private router: Router,
              private publishService: PublishService,
              public cacheService: CacheService,
              public authService: AuthService,
              private cdr: ChangeDetectorRef,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private appService: AppService,
              private deletionDialogService: ConfirmationDialogService,
              private clusterService: ClusterService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) {
        this.tabChange();
      }
    });
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CRONJOB) {
        const cronjobId = message.data;
        this.cronjobService.deleteById(cronjobId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '删除成功！');
              this.cronjobId = null;
              this.initCronjob(true);
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
    this.periodSyncStatus();
  }

  ngOnInit() {
    this.initShow();
  }

  diffTpl() {
    this.listCronjob.diffTpl();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscription.unsubscribe();
    this.tabScription.unsubscribe();
  }

  tabChange() {
    const orderList = [].slice.call(this.el.nativeElement.querySelectorAll('.tabs-item')).map((item, index) => {
      return {
        id: parseInt(item.id, 10),
        order: index
      };
    });
    if (this.orderCache && JSON.stringify(this.orderCache) === JSON.stringify(orderList)) {
      return;
    }
    this.cronjobService.updateOrder(this.appId, orderList).subscribe(
      response => {
        if (response.data === 'ok!') {
          this.initOrder();
          this.messageHandlerService.showSuccess('排序成功');
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  initOrder(deployments?: Cronjob[]) {
    if (deployments) {
      this.orderCache = deployments.map(item => {
        return {
          id: item.id,
          order: item.order
        };
      });
    } else {
      this.orderCache = [].slice.call(this.el.nativeElement.querySelectorAll('.tabs-item')).map((item, index) => {
        return {
          id: parseInt(item.id, 10),
          order: index
        };
      });
    }
  }

  onlineChange() {
    this.retrieve();
  }

  syncStatus() {
    if (this.changedCronjobTpls && this.changedCronjobTpls.length > 0) {
      for (let i = 0; i < this.changedCronjobTpls.length; i++) {
        const tpl = this.changedCronjobTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          // 定时自动刷新获取Job列表
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2) {
              continue;
            }
            this.kubernetesClient.get(status.cluster, KubeResourceCronJob, tpl.name, this.cacheService.kubeNamespace,
              this.appId.toString()).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.changedCronjobTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }
                this.changedCronjobTpls[i].status[j].kubeObj = response.data;
                // 防止切换tab tpls数据发生变化导致报错
                // let podInfo = response.data.pods;
                if (this.changedCronjobTpls &&
                  this.changedCronjobTpls[i] &&
                  this.changedCronjobTpls[i].status &&
                  this.changedCronjobTpls[i].status[j] &&
                  !response.data.spec.suspend) {
                  this.changedCronjobTpls[i].status[j].state = TemplateState.SUCCESS;
                } else {
                  this.changedCronjobTpls[i].status[j].state = TemplateState.FAILD;
                }
              },
              error => {
                if (this.changedCronjobTpls &&
                  this.changedCronjobTpls[i] &&
                  this.changedCronjobTpls[i].status &&
                  this.changedCronjobTpls[i].status[j]) {
                  this.changedCronjobTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.changedCronjobTpls[i].status[j].errNum} 次`);
                  if (this.changedCronjobTpls[i].status[j].errNum === 3) {
                    this.messageHandlerService.showError(`${status.cluster}的错误请求已经停止，请联系管理员解决`);
                  }
                }
                console.log(error);
              }
            );
          }
        }
      }
    }
  }

  periodSyncStatus() {
    this.timer = setInterval(() => {
      this.syncStatus();
    }, 5000);
  }

  tabClick(id: number, name: string) {
    if (id) {
      this.cronjobId = id;
      this.cronjobName = name;
      this.retrieve();
    }
  }

  ngAfterContentInit() {
    this.initCronjob();
  }

  initCronjob(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.cronjobId = parseInt(this.route.snapshot.params['cronjobId'], 10);
    combineLatest(
      this.clusterService.getNames(),
      this.cronjobService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + ''),
      this.appService.getById(this.appId, namespaceId),
    ).subscribe(
      response => {
        this.clusters = response[0].data;
        this.cronjobs = response[1].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.cronjobs);
        this.cronjobId = this.getCronjobId(this.cronjobId);
        this.cronjobName = this.getCronjobName(this.cronjobId);
        this.cdr.detectChanges();
        this.app = response[2].data;
        if (refreshTpl) {
          this.retrieve();
        }
        if (this.cronjobId) {
          this.cronjobService.getById(this.cronjobId, this.appId).subscribe(
            next => {
              this.currentCronjob = next.data;
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  getCronjobId(cronjobId: number): number {
    if (this.cronjobs && this.cronjobs.length > 0) {
      if (!cronjobId) {
        return this.cronjobs[0].id;
      }
      for (const cronjob of this.cronjobs) {
        if (cronjobId === cronjob.id) {
          return cronjobId;
        }
      }
      return this.cronjobs[0].id;
    } else {
      return null;
    }
  }

  getCronjobName(cronjobId: number): string {
    if (this.cronjobs && this.cronjobs.length > 0) {
      if (!cronjobId) {
        return this.cronjobs[0].name;
      }
      for (const cronjob of this.cronjobs) {
        if (cronjobId === cronjob.id) {
          return cronjob.name;
        }
      }
      return this.cronjobs[0].name;
    } else {
      return null;
    }
  }

  // 点击创建部署
  createCronjob(): void {
    this.createEditCronjob.newOrEditResource(this.app, this.filterCluster());
  }

  // 点击编辑部署
  editCronjob() {
    this.createEditCronjob.newOrEditResource(this.app, this.filterCluster(), this.cronjobId);
  }

  filterCluster(): Cluster[] {
    return this.clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.CRONJOB, this.cronjobId);
  }

  // 创建部署成功
  create(id: number) {
    if (id) {
      this.cronjobId = id;
      this.retrieveCronjobs();
      this.retrieve();
    }
  }

  // 点击创建模版
  createCronjobTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/cronjob/${this.cronjobId}/tpl`]);
  }

  // 点击克隆模版
  cloneCronjobTpl(tpl: CronjobTpl) {
    if (tpl) {
      this.router.navigate(
        [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/cronjob/${this.cronjobId}/tpl/${tpl.id}`]);
    }
  }

  deleteCronjob() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线' + this.componentName + '无法删除，请先下线' + this.componentName);
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除' + this.componentName + '确认',
        '是否确认删除' + this.componentName,
        this.cronjobId,
        ConfirmationTargets.CRONJOB,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.cronjobId) {
      return;
    }
    if (state) {
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.pageState.params['deleted'] = false;
    this.pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      this.cronjobTplService.listPage(this.pageState, this.appId, this.cronjobId.toString()),
      this.publishService.listStatus(PublishType.CRONJOB, this.cronjobId),
      this.cronjobService.getById(this.cronjobId, this.appId),
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tpls = response[0].data;
        this.currentCronjob = response[2].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.changedCronjobTpls = this.buildTplList(tpls.list, status);
        this.syncStatus();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  buildTplList(cronjobTpls: CronjobTpl[], status: PublishStatus[]): CronjobTpl[] {
    if (!cronjobTpls) {
      return cronjobTpls;
    }
    const tplStatusMap = {};
    if (status && status.length > 0) {
      for (const state of status) {
        if (!tplStatusMap[state.templateId]) {
          tplStatusMap[state.templateId] = Array<CronjobStatus>();
        }
        tplStatusMap[state.templateId].push(CronjobStatus.fromPublishStatus(state));
      }
    }

    const results = Array<CronjobTpl>();
    for (const cronjobTpl of cronjobTpls) {
      let kubeCronjob = new KubeCronJob();
      kubeCronjob = JSON.parse(cronjobTpl.template);
      // build container info
      const containers = kubeCronjob.spec.jobTemplate.spec.template.spec.containers;
      if (containers.length > 0) {
        const containerVersions = Array<string>();
        for (const con of containers) {
          containerVersions.push(con.image);
        }
        cronjobTpl.containerVersions = containerVersions;

        const publishStatus = tplStatusMap[cronjobTpl.id];
        if (publishStatus && publishStatus.length > 0) {
          cronjobTpl.status = publishStatus;
        }
      }
      // build schedule info
      cronjobTpl.schedule = kubeCronjob.spec.schedule;
      results.push(cronjobTpl);
    }
    return results;
  }

  retrieveCronjobs() {
    this.cronjobService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + '').subscribe(
      response => {
        this.cronjobs = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.cronjobs);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }
}
