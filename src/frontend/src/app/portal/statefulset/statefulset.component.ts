import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ClrDatagridStateInterface } from '@clr/angular';
import { App } from '../../shared/model/v1/app';
import { Cluster } from '../../shared/model/v1/cluster';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
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
import { CreateEditStatefulsetComponent } from './create-edit-statefulset/create-edit-statefulset.component';
import { ListStatefulsetComponent } from './list-statefulset/list-statefulset.component';
import { StatefulsetTemplate } from '../../shared/model/v1/statefulsettpl';
import { Statefulset } from '../../shared/model/v1/statefulset';
import { StatefulsetService } from '../../shared/client/v1/statefulset.service';
import { StatefulsetTplService } from '../../shared/client/v1/statefulsettpl.service';
import { StatefulsetClient } from '../../shared/client/v1/kubernetes/statefulset';
import { KubeStatefulSet } from '../../shared/model/v1/kubernetes/statefulset';
import { TemplateStatus } from '../../shared/model/v1/status';
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
  selector: 'wayne-statefulset',
  templateUrl: './statefulset.component.html',
  styleUrls: ['./statefulset.component.scss']
})
export class StatefulsetComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild(ListStatefulsetComponent, { static: false })
  listStatefulset: ListStatefulsetComponent;
  @ViewChild(CreateEditStatefulsetComponent, { static: false })
  createEditStatefulset: CreateEditStatefulsetComponent;

  pageState: PageState = new PageState();
  changedStatefulsetTpls: StatefulsetTemplate[];
  isOnline = false;
  statefulsetId: number;
  app: App;
  appId: number;
  clusters: Cluster[];
  statefulsets: Statefulset[];
  private timer: any = null;
  publishStatus: PublishStatus[];
  subscription: Subscription;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  showList: any[] = new Array();
  showState: object = showState;
  leave = false;

  constructor(
    private statefulsetService: StatefulsetService,
    private publishHistoryService: PublishHistoryService,
    private statefulsetTplService: StatefulsetTplService,
    private statefulsetClient: StatefulsetClient,
    private route: ActivatedRoute,
    private router: Router,
    private publishService: PublishService,
    public cacheService: CacheService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private appService: AppService,
    private tabDragService: TabDragService,
    private el: ElementRef,
    public translate: TranslateService,
    private deletionDialogService: ConfirmationDialogService,
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService
  ) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) {
        this.tabChange();
      }
    });
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.STATEFULSET) {
        const statefulsetId = message.data;
        this.statefulsetService.deleteById(statefulsetId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('状态副本集删除成功！');
              this.statefulsetId = null;
              this.initStatefulset(true);
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

  /**
   * diff
   */
  diffTpl() {
    this.listStatefulset.diffTpl();
  }
  /************************************** */

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
    this.statefulsetService.updateOrder(this.appId, orderList).subscribe(
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

  initOrder(deployments?: Statefulset[]) {
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
    if (this.changedStatefulsetTpls && this.changedStatefulsetTpls.length > 0) {
      for (let i = 0; i < this.changedStatefulsetTpls.length; i++) {
        const tpl = this.changedStatefulsetTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2)  { continue; }
            this.statefulsetClient.get(this.appId, status.cluster, this.cacheService.kubeNamespace, tpl.name).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.changedStatefulsetTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }

                const podInfo = response.data.pods;
                // 防止切换tab tpls数据发生变化导致报错
                if (this.changedStatefulsetTpls &&
                  this.changedStatefulsetTpls[i] &&
                  this.changedStatefulsetTpls[i].status &&
                  this.changedStatefulsetTpls[i].status[j]) {
                  let state = TemplateState.FAILD;
                  if (podInfo.current === podInfo.desired) {
                    state = TemplateState.SUCCESS;
                  }
                  this.changedStatefulsetTpls[i].status[j].state = state;
                  this.changedStatefulsetTpls[i].status[j].current = podInfo.current;
                  this.changedStatefulsetTpls[i].status[j].desired = podInfo.desired;
                  this.changedStatefulsetTpls[i].status[j].warnings = podInfo.warnings;
                }
              },
              error => {
                if (this.changedStatefulsetTpls &&
                  this.changedStatefulsetTpls[i] &&
                  this.changedStatefulsetTpls[i].status &&
                  this.changedStatefulsetTpls[i].status[j]) {
                  this.changedStatefulsetTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.changedStatefulsetTpls[i].status[j].errNum} 次`);
                  if (this.changedStatefulsetTpls[i].status[j].errNum === 3) {
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
      this.statefulsetId = id;
      this.navigateUri();
      this.retrieve();
    }
  }

  ngAfterContentInit() {
    this.initStatefulset();
  }

  initStatefulset(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.statefulsetId = parseInt(this.route.snapshot.params['statefulsetId'], 10);
    combineLatest(
      [this.clusterService.getNames(),
      this.statefulsetService.listPage(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), this.appId, 'false'),
      this.appService.getById(this.appId, namespaceId)]
    ).subscribe(
      response => {
        this.clusters = response[0].data;
        this.statefulsets = response[1].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.statefulsets);
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
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/statefulset/${this.statefulsetId}`]);
  }

  redirectUri(): boolean {
    if (this.statefulsets && this.statefulsets.length > 0) {
      if (!this.statefulsetId) {
        this.statefulsetId = this.statefulsets[0].id;
        return true;
      }
      for (const stateful of this.statefulsets) {
        if (this.statefulsetId === stateful.id) {
          return false;
        }
      }
      this.statefulsetId = this.statefulsets[0].id;
      return true;
    } else {
      return false;
    }
  }

  // 点击创建状态副本集
  createStatefulset(): void {
    this.createEditStatefulset.newOrEditResource(this.app, this.filterCluster());
  }

  // 点击编辑状态副本集
  editStatefulset() {
    this.createEditStatefulset.newOrEditResource(this.app, this.filterCluster(), this.statefulsetId);
  }

  filterCluster(): Cluster[] {
    return this.clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.STATEFULSET, this.statefulsetId);
  }

  // 创建状态副本集成功
  create(id: number) {
    if (id) {
      this.statefulsetId = id;
      this.retrieveStatefulsets();
      this.navigateUri();
      this.retrieve();
    }
  }

  // 点击创建状态副本集模版
  createStatefulsetTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/statefulset/${this.statefulsetId}/tpl`]);
  }

  // 点击克隆状态副本集模版
  cloneStatefulsetTpl(tpl: StatefulsetTemplate) {
    if (tpl) {
      this.router.navigate(
        [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/statefulset/${this.statefulsetId}/tpl/${tpl.id}`]);
    }
  }

  deleteStatefulset() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线状态副本集无法删除，请先下线状态副本集！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除状态副本集确认',
        '是否确认删除状态副本集',
        this.statefulsetId,
        ConfirmationTargets.STATEFULSET,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.statefulsetId) {
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
    this.pageState.params['statefulsetId'] = this.statefulsetId;
    this.pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      [this.statefulsetTplService.listPage(this.pageState, this.appId),
      this.publishService.listStatus(PublishType.STATEFULSET, this.statefulsetId)]
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tpls = response[0].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.changedStatefulsetTpls = this.buildTplList(tpls.list, status);
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

  buildTplList(statefulsetTpls: StatefulsetTemplate[], status: PublishStatus[]): StatefulsetTemplate[] {
    if (!statefulsetTpls) {
      return statefulsetTpls;
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

    const results = Array<StatefulsetTemplate>();
    for (const statefulsetTpl of statefulsetTpls) {
      let kubeStatefulset = new KubeStatefulSet();
      kubeStatefulset = JSON.parse(statefulsetTpl.template);
      const containers = kubeStatefulset.spec.template.spec.containers;
      if (containers.length > 0) {
        const containerVersions = Array<string>();
        for (const con of containers) {
          containerVersions.push(con.image);
        }
        statefulsetTpl.containerVersions = containerVersions;

        const publishStatus = tplStatusMap[statefulsetTpl.id];
        if (publishStatus && publishStatus.length > 0) {
          statefulsetTpl.status = publishStatus;
        }
      }
      results.push(statefulsetTpl);
    }
    return results;
  }

  retrieveStatefulsets() {
    this.statefulsetService.listPage(PageState.fromState({
      sort: {
        by: 'id',
        reverse: false
      }
    }, {pageSize: 1000}), this.appId, 'false').subscribe(
      response => {
        this.statefulsets = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.statefulsets);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


}
