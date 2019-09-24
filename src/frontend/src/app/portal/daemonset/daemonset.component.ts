import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { combineLatest } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../shared/auth/auth.service';
import { CacheService } from '../../shared/auth/cache.service';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { DaemonSetService } from '../../shared/client/v1/daemonset.service';
import { DaemonSetTplService } from '../../shared/client/v1/daemonsettpl.service';
import { DaemonSetClient } from '../../shared/client/v1/kubernetes/daemonset';
import { PublishService } from '../../shared/client/v1/publish.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { App } from '../../shared/model/v1/app';
import { Cluster } from '../../shared/model/v1/cluster';
import { DaemonSet } from '../../shared/model/v1/daemonset';
import { DaemonSetTemplate } from '../../shared/model/v1/daemonsettpl';
import { KubeDaemonSet } from '../../shared/model/v1/kubernetes/daemonset';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { TemplateStatus } from '../../shared/model/v1/status';
import { PageState } from '../../shared/page/page-state';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  PublishType,
  TemplateState
} from '../../shared/shared.const';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { CreateEditDaemonSetComponent } from './create-edit-daemonset/create-edit-daemonset.component';
import { ListDaemonSetComponent } from './list-daemonset/list-daemonset.component';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { OrderItem } from '../../shared/model/v1/order';
import { TranslateService } from '@ngx-translate/core';

const showState = {
  'create_time': {hidden: false},
  'version': {hidden: false},
  'online_cluster': {hidden: false},
  'release_explain': {hidden: false},
  'create_user': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-daemonset',
  templateUrl: './daemonset.component.html',
  styleUrls: ['./daemonset.component.scss']
})
export class DaemonSetComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild(ListDaemonSetComponent, { static: false })
  listDaemonSet: ListDaemonSetComponent;
  @ViewChild(CreateEditDaemonSetComponent, { static: false })
  createEditDaemonSet: CreateEditDaemonSetComponent;

  pageState: PageState = new PageState();
  changedDaemonSetTpls: DaemonSetTemplate[];
  isOnline = false;
  daemonSetId: number;
  app: App;
  appId: number;
  clusters: Cluster[];
  daemonSets: DaemonSet[];
  private timer: any = null;
  publishStatus: PublishStatus[];
  subscription: Subscription;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  showList: any[] = new Array();
  showState: object = showState;
  leave = false;

  constructor(private daemonSetService: DaemonSetService,
              private publishHistoryService: PublishHistoryService,
              private daemonSetTplService: DaemonSetTplService,
              private daemonSetClient: DaemonSetClient,
              private route: ActivatedRoute,
              private router: Router,
              private publishService: PublishService,
              public cacheService: CacheService,
              public authService: AuthService,
              private cdr: ChangeDetectorRef,
              private appService: AppService,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private deletionDialogService: ConfirmationDialogService,
              private clusterService: ClusterService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) { this.tabChange(); }
    });
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DAEMONSET) {
        const daemonSetId = message.data;
        this.daemonSetService.deleteById(daemonSetId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('守护进程集删除成功！');
              this.daemonSetId = null;
              this.initDaemonSet(true);
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
    this.listDaemonSet.diffTpl();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) { this.showList.push(key); }
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
    this.leave = true;
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
    if (this.orderCache && JSON.stringify(this.orderCache) === JSON.stringify(orderList)) { return; }
    this.daemonSetService.updateOrder(this.appId, orderList).subscribe(
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

  initOrder(deployments?: DaemonSet[]) {
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
    if (this.changedDaemonSetTpls && this.changedDaemonSetTpls.length > 0) {
      for (let i = 0; i < this.changedDaemonSetTpls.length; i++) {
        const tpl = this.changedDaemonSetTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2)  { continue; }
            this.daemonSetClient.get(this.appId, status.cluster, this.cacheService.kubeNamespace, tpl.name).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.changedDaemonSetTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }

                const podInfo = response.data.pods;
                // 防止切换tab tpls数据发生变化导致报错
                if (this.changedDaemonSetTpls &&
                  this.changedDaemonSetTpls[i] &&
                  this.changedDaemonSetTpls[i].status &&
                  this.changedDaemonSetTpls[i].status[j]) {
                  let state = TemplateState.FAILD;
                  if (podInfo.current === podInfo.desired) {
                    state = TemplateState.SUCCESS;
                  }
                  this.changedDaemonSetTpls[i].status[j].state = state;
                  this.changedDaemonSetTpls[i].status[j].current = podInfo.current;
                  this.changedDaemonSetTpls[i].status[j].desired = podInfo.desired;
                  this.changedDaemonSetTpls[i].status[j].warnings = podInfo.warnings;
                }
              },
              error => {
                if (this.changedDaemonSetTpls &&
                  this.changedDaemonSetTpls[i] &&
                  this.changedDaemonSetTpls[i].status &&
                  this.changedDaemonSetTpls[i].status[j]) {
                  this.changedDaemonSetTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.changedDaemonSetTpls[i].status[j].errNum} 次`);
                  if (this.changedDaemonSetTpls[i].status[j].errNum === 3) {
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

  tabClick(id: number) {
    if (id) {
      this.daemonSetId = id;
      this.navigateUri();
      this.retrieve();
    }
  }

  ngAfterContentInit() {
    this.initDaemonSet();
  }

  initDaemonSet(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.daemonSetId = parseInt(this.route.snapshot.params['daemonSetId'], 10);
    combineLatest(
      [this.clusterService.getNames(),
      this.daemonSetService.listPage(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), this.appId, 'false'),
      this.appService.getById(this.appId, namespaceId)]
    ).subscribe(
      response => {
        this.clusters = response[0].data;
        this.daemonSets = response[1].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.daemonSets);
        this.app = response[2].data;
        const isRedirectUri = this.redirectUri();
        if (isRedirectUri) {
          this.navigateUri();
        }
        this.cdr.detectChanges();
        if (refreshTpl) {
          this.retrieve();
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  navigateUri() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/daemonset/${this.daemonSetId}`]);
  }

  redirectUri(): boolean {
    if (this.daemonSets && this.daemonSets.length > 0) {
      if (!this.daemonSetId) {
        this.daemonSetId = this.daemonSets[0].id;
        return true;
      }
      for (const daemon of this.daemonSets) {
        if (this.daemonSetId === daemon.id) {
          return false;
        }
      }
      this.daemonSetId = this.daemonSets[0].id;
      return true;
    } else {
      return false;
    }
  }

  // 点击创建守护进程集
  createDaemonSet(): void {
    this.createEditDaemonSet.newOrEditResource(this.app, this.filterCluster());
  }

  // 点击编辑守护进程集
  editDaemonSet() {
    this.createEditDaemonSet.newOrEditResource(this.app, this.filterCluster(), this.daemonSetId);
  }

  filterCluster(): Cluster[] {
    return this.clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.DAEMONSET, this.daemonSetId);
  }

  // 创建守护进程集成功
  create(id: number) {
    if (id) {
      this.daemonSetId = id;
      this.retrieveDaemonSets();
      this.navigateUri();
      this.retrieve();
    }
  }

  // 点击创建守护进程集模版
  createDaemonSetTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/daemonset/${this.daemonSetId}/tpl`]);
  }

  // 点击克隆守护进程集模版
  cloneDaemonSetTpl(tpl: DaemonSetTemplate) {
    if (tpl) {
      this.router.navigate(
        [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/daemonset/${this.daemonSetId}/tpl/${tpl.id}`]);
    }
  }

  deleteDaemonSet() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线守护进程集无法删除，请先下线守护进程集！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除守护进程集确认',
        '是否确认删除守护进程集',
        this.daemonSetId,
        ConfirmationTargets.DAEMONSET,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.daemonSetId) {
      return;
    }
    if (state) {
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    if (!this.pageState.sort.by) {
      this.pageState.sort.by = 'id';
      this.pageState.sort.reverse = true;
    }
    this.pageState.params['deleted'] = false;
    this.pageState.params['daemonSetId'] = this.daemonSetId;
    this.pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      [this.daemonSetTplService.listPage(this.pageState, this.appId),
      this.publishService.listStatus(PublishType.DAEMONSET, this.daemonSetId)]
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tpls = response[0].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.changedDaemonSetTpls = this.buildTplList(tpls.list, status);
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

  buildTplList(daemonSetTpls: DaemonSetTemplate[], status: PublishStatus[]): DaemonSetTemplate[] {
    if (!daemonSetTpls) {
      return daemonSetTpls;
    }
    const tplStatusMap = {};
    if (status && status.length > 0) {
      for (const state of status) {
        if (!tplStatusMap[state.templateId]) {
          tplStatusMap[state.templateId] = Array<TemplateStatus>();
        }
        tplStatusMap[state.templateId].push(TemplateStatus.fromPublishStatus(state));
      }
    }

    const results = Array<DaemonSetTemplate>();
    for (const daemonSetTpl of daemonSetTpls) {
      let kubeDaemonSet = new KubeDaemonSet();
      kubeDaemonSet = JSON.parse(daemonSetTpl.template);
      const containers = kubeDaemonSet.spec.template.spec.containers;
      if (containers.length > 0) {
        const containerVersions = Array<string>();
        for (const con of containers) {
          containerVersions.push(con.image);
        }
        daemonSetTpl.containerVersions = containerVersions;

        const publishStatus = tplStatusMap[daemonSetTpl.id];
        if (publishStatus && publishStatus.length > 0) {
          daemonSetTpl.status = publishStatus;
        }
      }
      results.push(daemonSetTpl);
    }
    return results;
  }

  retrieveDaemonSets() {
    this.daemonSetService.listPage(PageState.fromState({
      sort: {
        by: 'id',
        reverse: false
      }
    }, {pageSize: 1000}), this.appId, 'false').subscribe(
      response => {
        this.daemonSets = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.daemonSets);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


}
