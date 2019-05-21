import { PublishHistoryService } from '../../../portal/common/publish-history/publish-history.service';
import { TabDragService } from '../../client/v1/tab-drag.service';
import { OrderItem } from '../../model/v1/order';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { Cluster } from '../../model/v1/cluster';
import { ClusterService } from '../../client/v1/cluster.service';
import { AppService } from '../../client/v1/app.service';
import { PageState } from '../../page/page-state';
import { PublishStatus } from '../../model/v1/publish-status';
import { AuthService } from '../../auth/auth.service';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { CacheService } from '../../auth/cache.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { App } from '../../model/v1/app';
import { PublishService } from '../../client/v1/publish.service';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  KubeResourcesName,
  PublishType,
  TemplateState
} from '../../shared.const';
import { combineLatest } from 'rxjs';
import { ClrDatagridStateInterface } from '@clr/angular';
import { CreateEditResource } from './create-edit-resource';
import { ListResource } from './list-resource';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';

export class Resource {
  createEditResourceComponent: CreateEditResource;
  listResourceComponent: ListResource;

  pageState: PageState = new PageState();

  isOnline = false;
  timer: any = null;

  subscription: Subscription;
  showList: any[] = new Array();
  showState: object;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;

  resources: any[];
  templates: any[];
  resourceId: number;
  app: App;
  appId: number;
  clusters: Cluster[];
  publishStatus: PublishStatus[];

  resourceType: string;
  message: string;
  publishType: PublishType;
  confirmationTarget: ConfirmationTargets;

  kubeResource: KubeResourcesName;

  constructor(public resourceService: any,
              public templateService: any,
              public kubernetesClient: KubernetesClient,
              public publishHistoryService: PublishHistoryService,
              public route: ActivatedRoute,
              public router: Router,
              public publishService: PublishService,
              public cacheService: CacheService,
              public authService: AuthService,
              public cdr: ChangeDetectorRef,
              public appService: AppService,
              public deletionDialogService: ConfirmationDialogService,
              public clusterService: ClusterService,
              public tabDragService: TabDragService,
              public el: ElementRef,
              public messageHandlerService: MessageHandlerService) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) {
        this.onResourceTabChanged();
      }
    });
  }

  registKubeResource(kubeResource: string) {
    this.kubeResource = kubeResource;
  }

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  registPublishType(publishType: PublishType) {
    this.publishType = publishType;
  }

  registConfirmationTarget(confirmationTarget: ConfirmationTargets) {
    this.confirmationTarget = confirmationTarget;
  }

  registShowState(showState: object) {
    this.showState = showState;

  }

  registSubscription(msg: string) {
    this.subscription = this.deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === this.confirmationTarget) {
        const resourceId = message.data;
        this.resourceService.deleteById(resourceId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(msg);
              this.resourceId = null;
              this.initResource(true);
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  // 创建资源的动作
  createResource(): void {
    this.createEditResourceComponent.newOrEditResource(this.app, this.filterCluster());
  }

  // 编辑资源的动作
  editResource() {
    this.createEditResourceComponent.newOrEditResource(this.app, this.filterCluster(), this.resourceId);
  }

  // 删除资源的动作
  deleteResource(title: string, message: string, warningMessage: string) {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning(warningMessage);
    } else {
      const deletionMessage = new ConfirmationMessage(
        title, message, this.resourceId, this.confirmationTarget, ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  // 创建模板的动作
  createTemplate() {
    this.router.navigate(
      [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resourceId}/tpl`]
    );
  }

  // 克隆模板的动作
  cloneTemplate(tpl: any) {
    if (tpl) {
      this.router.navigate(
        [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resourceId}/tpl/${tpl.id}`]
      );
    }
  }

  filterCluster(): Cluster[] {
    return this.clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  // 展示发布历史
  listPublishHistory() {
    this.publishHistoryService.openModal(this.publishType, this.resourceId);
  }

  // 创建操作执行后重新加载数据
  reloadAfterCreate(id: number) {
    if (id) {
      this.resourceId = id;
      this.retrieveResources();
      this.setNavigateURI();
      this.retrieveTemplates();
    }
  }

  // 获取模板列表
  retrieveTemplates(state?: ClrDatagridStateInterface): void {
    if (!this.resourceId) {
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
      this.templateService.listPage(this.pageState, this.appId, this.resourceId.toString()),
      this.publishService.listStatus(this.publishType, this.resourceId)
    ).subscribe(
      response => {
        this.pageState.page.totalPage = response[0]['data'].totalPage;
        this.pageState.page.totalCount = response[0]['data'].totalCount;
        this.publishStatus = response[1].data;
        this.generateTemplateList(response[0]['data'].list, response[1].data);
        this.addStatusInfo();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  // 获取资源列表
  retrieveResources() {
    this.resourceService.list(PageState.fromState(
      {sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + '').subscribe(
      response => {
        this.resources = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.resources);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  // 绑定模板数据和发布状态数据的接口，每个资源的处理方式都有差别
  generateTemplateList(templatedata: any[], publishdata: any[]): void {
  }

  // 添加线上状态信息
  addStatusInfo(): void {
    if (this.templates && this.templates.length > 0) {
      for (let i = 0; i < this.templates.length; i++) {
        const tpl = this.templates[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2) {
              continue;
            }
            this.kubernetesClient.get(status.cluster, this.kubeResource, tpl.name,
              this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.templates[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }
                if (response.data &&
                  this.templates &&
                  this.templates[i] &&
                  this.templates[i].status &&
                  this.templates[i].status[j]) {
                  this.templates[i].status[j].state = TemplateState.SUCCESS;
                } else {
                  this.templates[i].status[j].state = TemplateState.FAILD;
                }
              },
              error => {
                if (this.templates &&
                  this.templates[i] &&
                  this.templates[i].status &&
                  this.templates[i].status[j]) {
                  this.templates[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster} 请求错误次数 ${this.templates[i].status[j].errNum} 次`);
                  if (this.templates[i].status[j].errNum === 3) {
                    this.messageHandlerService.showError(`${status.cluster} 的错误请求已经停止，请联系管理员解决`);
                  }
                }
              }
            );
          }
        }
      }
    }
  }

  // 初始化资源列表
  initResource(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.resourceId = parseInt(this.route.snapshot.params['resourceId'], 10);
    combineLatest(
      this.clusterService.getNames(),
      this.resourceService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + ''),
      this.appService.getById(this.appId, namespaceId)
    ).subscribe(
      response => {
        this.clusters = response[0].data;
        this.resources = response[1]['data'].list.sort((a, b) => a.order - b.order);
        this.initOrder(this.resources);
        this.app = response[2].data;
        if (refreshTpl) {
          this.retrieveTemplates();
        }
        if (this.initDefaultResourceId() === true) {
          this.setNavigateURI();
        }
        this.cdr.detectChanges();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  // 更新路由
  setNavigateURI() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resourceId}`]);
  }

  // 初始化默认资源 ID 号
  initDefaultResourceId(): boolean {
    if (this.resources && this.resources.length > 0) {
      if (!this.resourceId) {
        this.resourceId = this.resources[0].id;
        return true;
      }
      for (const resource of this.resources) {
        if (this.resourceId === resource.id) {
          return false;
        }
      }
      this.resourceId = this.resources[0].id;
      return true;
    } else {
      return false;
    }
  }

  // 初始化 show list
  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  // 监听确认按钮触发的事件
  onConfirmClick() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  // 监听退出按钮触发的事件
  onCancelClick() {
    this.initShow();
  }

  // 监听模板列表发生变化的事件
  onTemplateListChanged() {
    this.retrieveTemplates();
  }

  // 监听重新排序的事件
  onResourceTabChanged() {
    const orderList = [].slice.call(this.el.nativeElement.querySelectorAll('.tabs-item')).map((item, index) => {
      return {
        id: parseInt(item.id, 10),
        order: index
      };
    });
    if (this.orderCache && JSON.stringify(this.orderCache) === JSON.stringify(orderList)) {
      return;
    }
    this.resourceService.updateOrder(this.appId, orderList).subscribe(
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

  // 监听创建资源之后出发的重新处理资源的事件
  onResourceCreatedEvent(id: number) {
    if (id) {
      this.resourceId = id;
      this.setNavigateURI();
      combineLatest(
        this.resourceService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + ''),
      ).subscribe(
        response => {
          this.resources = response[0]['data'].list.sort((a, b) => a.order - b.order);
          this.initOrder(this.resources);
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
      this.retrieveTemplates();
    }
  }

  onShowDiffEvent() {
    this.listResourceComponent.onShowDiffEvent();
  }

  // 用于对获取的资源列表排序的工作
  initOrder(resources?: any[]) {
    if (resources) {
      this.orderCache = resources.map(item => {
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

}
