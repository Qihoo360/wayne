import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListDeploymentComponent } from './list-deployment/list-deployment.component';
import { CreateEditDeploymentComponent } from './create-edit-deployment/create-edit-deployment.component';
import { ClrDatagridStateInterface } from '@clr/angular';
import { DeploymentClient } from '../../shared/client/v1/kubernetes/deployment';
import { DeploymentStatus, DeploymentTpl } from '../../shared/model/v1/deploymenttpl';
import { App } from '../../shared/model/v1/app';
import { Cluster } from '../../shared/model/v1/cluster';
import { Deployment } from '../../shared/model/v1/deployment';
import { DeploymentService } from '../../shared/client/v1/deployment.service';
import { DeploymentTplService } from '../../shared/client/v1/deploymenttpl.service';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { KubeDeployment } from '../../shared/model/v1/kubernetes/deployment';
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
import { combineLatest } from 'rxjs';
import { PageState } from '../../shared/page/page-state';
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
  selector: 'wayne-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild(ListDeploymentComponent, { static: false })
  listDeployment: ListDeploymentComponent;
  @ViewChild(CreateEditDeploymentComponent, { static: false })
  createEditDeployment: CreateEditDeploymentComponent;

  pageState: PageState = new PageState();
  changedDeploymentTpls: DeploymentTpl[];
  isOnline = false;
  deploymentId: number;
  app: App;
  appId: number;
  clusters: Cluster[];
  deployments: Deployment[];
  private timer: any = null;
  publishStatus: PublishStatus[];
  subscription: Subscription;
  showList: any[] = new Array();
  showState: object = showState;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  leave = false;

  constructor(private deploymentService: DeploymentService,
              private publishHistoryService: PublishHistoryService,
              private deploymentTplService: DeploymentTplService,
              private deploymentClient: DeploymentClient,
              private route: ActivatedRoute,
              public translate: TranslateService,
              private router: Router,
              private publishService: PublishService,
              public cacheService: CacheService,
              public authService: AuthService,
              private cdr: ChangeDetectorRef,
              private appService: AppService,
              private deletionDialogService: ConfirmationDialogService,
              private clusterService: ClusterService,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private messageHandlerService: MessageHandlerService) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) {
        this.tabChange();
      }
    });
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.DEPLOYMENT) {
        const deploymentId = message.data;
        this.deploymentService.deleteById(deploymentId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('部署删除成功！');
              this.deploymentId = null;
              this.initDeployment(true);
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
    this.listDeployment.diffTpl();
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

  onlineChange() {
    this.retrieve();
  }

  tabChange() {
    const orderList = [].slice.call(this.el.nativeElement.querySelectorAll('.tabs-item')).map((item, index) => {
      return {
        id: parseInt(item.id, 10),
        order: index
      };
    });
    if (this.orderCache && JSON.stringify(this.orderCache) === JSON.stringify(orderList)) { return; }
    this.deploymentService.updateOrder(this.appId, orderList).subscribe(
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

  syncStatus() {
    if (this.changedDeploymentTpls && this.changedDeploymentTpls.length > 0) {
      for (let i = 0; i < this.changedDeploymentTpls.length; i++) {
        const tpl = this.changedDeploymentTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            // 错误超过俩次时候停止请求
            if (status.errNum > 2)  { continue; }
            this.deploymentClient.getDetail(this.appId, status.cluster, this.cacheService.kubeNamespace, tpl.name).subscribe(
              next => {
                const code = next.statusCode || next.status;
                if (code === httpStatusCode.NoContent) {
                  this.changedDeploymentTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }

                const podInfo = next.data.pods;
                // 防止切换tab tpls数据发生变化导致报错
                if (this.changedDeploymentTpls &&
                  this.changedDeploymentTpls[i] &&
                  this.changedDeploymentTpls[i].status &&
                  this.changedDeploymentTpls[i].status[j]) {
                  let state = TemplateState.FAILD;
                  if (podInfo.current === podInfo.desired) {
                    state = TemplateState.SUCCESS;
                  }
                  this.changedDeploymentTpls[i].status[j].errNum = 0;
                  this.changedDeploymentTpls[i].status[j].state = state;
                  this.changedDeploymentTpls[i].status[j].current = podInfo.current;
                  this.changedDeploymentTpls[i].status[j].desired = podInfo.desired;
                  this.changedDeploymentTpls[i].status[j].warnings = podInfo.warnings;
                }
              },
              error => {
                if (this.changedDeploymentTpls &&
                  this.changedDeploymentTpls[i] &&
                  this.changedDeploymentTpls[i].status &&
                  this.changedDeploymentTpls[i].status[j]) {
                  this.changedDeploymentTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.changedDeploymentTpls[i].status[j].errNum} 次`);
                  if (this.changedDeploymentTpls[i].status[j].errNum === 3) {
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
      this.deploymentId = id;
      this.navigateUri();
      this.retrieve();
    }
  }

  ngAfterContentInit() {
    this.initDeployment();
  }

  initDeployment(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.deploymentId = parseInt(this.route.snapshot.params['deploymentId'], 10);
    combineLatest(
      [this.clusterService.getNames(),
      this.deploymentService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + ''),
      this.appService.getById(this.appId, namespaceId)]
    ).subscribe(
      response => {
        this.clusters = response[0].data;
        this.deployments = response[1].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.deployments);
        this.app = response[2].data;
        if (refreshTpl) {
          this.retrieve();
        }
        const isRedirectUri = this.redirectUri();
        if (isRedirectUri) {
          this.navigateUri();
        }
        this.cdr.detectChanges();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  navigateUri() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/deployment/${this.deploymentId}`]);
  }

  redirectUri(): boolean {
    if (this.deployments && this.deployments.length > 0) {
      if (!this.deploymentId) {
        this.deploymentId = this.deployments[0].id;
        return true;
      }
      for (const deployment of this.deployments) {
        if (this.deploymentId === deployment.id) {
          return false;
        }
      }
      this.deploymentId = this.deployments[0].id;
      return true;
    } else {
      return false;
    }
  }

  initOrder(deployments?: Deployment[]) {
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

  getDeploymentId(deploymentId: number): number {
    if (this.deployments && this.deployments.length > 0) {
      if (!deploymentId) {
        return this.deployments[0].id;
      }
      for (const deployment of this.deployments) {
        if (deploymentId === deployment.id) {
          return deploymentId;
        }
      }
      return this.deployments[0].id;
    } else {
      return null;
    }
  }

  // 点击创建部署
  createDeployment(): void {
    this.createEditDeployment.newOrEditResource(this.app, this.filterCluster());
  }

  // 点击编辑部署
  editDeployment() {
    this.createEditDeployment.newOrEditResource(this.app, this.filterCluster(), this.deploymentId);
  }

  filterCluster(): Cluster[] {
    return this.clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.DEPLOYMENT, this.deploymentId);
  }

  // 创建部署成功
  create(id: number) {
    if (id) {
      this.deploymentId = id;
      this.retrieveDeployments();
      this.navigateUri();
      this.retrieve();
    }
  }

  // 点击创建部署模版
  createDeploymentTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/deployment/${this.deploymentId}/tpl`]);
  }

  // 点击克隆部署模版
  cloneDeploymentTpl(tpl: DeploymentTpl) {
    if (tpl) {
      this.router.navigate(
        [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/deployment/${this.deploymentId}/tpl/${tpl.id}`]);
    }
  }

  deleteDeployment() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线部署无法删除，请先下线部署！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除部署确认',
        '是否确认删除部署',
        this.deploymentId,
        ConfirmationTargets.DEPLOYMENT,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.deploymentId) {
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
      [this.deploymentTplService.listPage(this.pageState, this.appId, this.deploymentId.toString()),
      this.publishService.listStatus(PublishType.DEPLOYMENT, this.deploymentId)]
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tpls = response[0].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.changedDeploymentTpls = this.buildTplList(tpls.list, status);
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

  buildTplList(deploymentTpls: DeploymentTpl[], status: PublishStatus[]): DeploymentTpl[] {
    if (!deploymentTpls) {
      return deploymentTpls;
    }
    const tplStatusMap = {};
    if (status && status.length > 0) {
      for (const state of status) {
        if (!tplStatusMap[state.templateId]) {
          tplStatusMap[state.templateId] = Array<DeploymentStatus>();
        }
        tplStatusMap[state.templateId].push(DeploymentStatus.fromPublishStatus(state));
      }
    }

    const results = Array<DeploymentTpl>();
    for (const deploymentTpl of deploymentTpls) {
      let kubeDeployment = new KubeDeployment();
      kubeDeployment = JSON.parse(deploymentTpl.template);
      const containers = kubeDeployment.spec.template.spec.containers;
      if (containers.length > 0) {
        const containerVersions = Array<string>();
        for (const con of containers) {
          containerVersions.push(con.image);
        }
        deploymentTpl.containerVersions = containerVersions;

        const publishStatus = tplStatusMap[deploymentTpl.id];
        if (publishStatus && publishStatus.length > 0) {
          deploymentTpl.status = publishStatus;
        }
      }
      results.push(deploymentTpl);
    }
    return results;
  }

  retrieveDeployments() {
    this.deploymentService.list(PageState.fromState({
      sort: {
        by: 'id',
        reverse: false
      }
    }, {pageSize: 1000}), 'false', this.appId + '').subscribe(
      response => {
        this.deployments = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.deployments);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


}
