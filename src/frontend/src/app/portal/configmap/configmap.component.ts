import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  KubeResourceConfigMap,
  PublishType,
  syncStatusInterval,
  TemplateState
} from '../../shared/shared.const';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListConfigMapComponent } from './list-configmap/list-configmap.component';
import { CreateEditConfigMapComponent } from './create-edit-configmap/create-edit-configmap.component';
import { combineLatest } from 'rxjs';
import { AppService } from '../../shared/client/v1/app.service';
import { ConfigMapService } from '../../shared/client/v1/configmap.service';
import { ConfigMapTplService } from '../../shared/client/v1/configmaptpl.service';
import { ConfigMap } from '../../shared/model/v1/configmap';
import { ConfigMapTpl } from '../../shared/model/v1/configmaptpl';
import { App } from '../../shared/model/v1/app';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { AuthService } from '../../shared/auth/auth.service';
import { PublishService } from '../../shared/client/v1/publish.service';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../shared/page/page-state';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { OrderItem } from '../../shared/model/v1/order';
import { TranslateService } from '@ngx-translate/core';
import { KubernetesClient } from '../../shared/client/v1/kubernetes/kubernetes';

const showState = {
  'create_time': {hidden: false},
  'config_cluster': {hidden: false},
  'online_cluster': {hidden: false},
  'release_explain': {hidden: false},
  'create_user': {hidden: false},
  'action': {hidden: false}
};

@Component({
  selector: 'wayne-configmap',
  templateUrl: './configmap.component.html',
  styleUrls: ['./configmap.component.scss']
})
export class ConfigMapComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild(ListConfigMapComponent)
  list: ListConfigMapComponent;
  @ViewChild(CreateEditConfigMapComponent)
  createEdit: CreateEditConfigMapComponent;
  configMapId: number;
  pageState: PageState = new PageState();
  isOnline = false;
  configMaps: ConfigMap[];
  configMapTpls: ConfigMapTpl[];
  app: App;
  private timer: any = null;
  tplStatusMap = {};
  publishStatus: PublishStatus[];
  subscription: Subscription;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  showList: any[] = new Array();
  showState: object = showState;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private publishService: PublishService,
              private publishHistoryService: PublishHistoryService,
              public cacheService: CacheService,
              private appService: AppService,
              private kubernetesClient: KubernetesClient,
              private configMapService: ConfigMapService,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private deletionDialogService: ConfirmationDialogService,
              public authService: AuthService,
              private configMapTplService: ConfigMapTplService,
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
        message.source === ConfirmationTargets.CONFIGMAP) {
        const configMapId = message.data;
        this.configMapService.deleteById(configMapId, this.app.id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置集删除成功！');
              this.configMapId = null;
              this.initConfigMap(true);
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
    this.list.diffTpl();
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
    this.configMapService.updateOrder(this.app.id, orderList).subscribe(
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

  initOrder(deployments?: ConfigMap[]) {
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

  periodSyncStatus() {
    this.timer = setInterval(() => {
      this.syncStatus();
    }, syncStatusInterval);
  }

  syncStatus(): void {
    if (this.configMapTpls && this.configMapTpls.length > 0) {
      for (let i = 0; i < this.configMapTpls.length; i++) {
        const tpl = this.configMapTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2) {
              continue;
            }
            this.kubernetesClient.get(status.cluster, KubeResourceConfigMap, tpl.name,
              this.cacheService.kubeNamespace, this.app.id.toString()).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.configMapTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }
                if (response.data &&
                  this.configMapTpls &&
                  this.configMapTpls[i] &&
                  this.configMapTpls[i].status &&
                  this.configMapTpls[i].status[j]) {
                  this.configMapTpls[i].status[j].state = TemplateState.SUCCESS;
                } else {
                  this.configMapTpls[i].status[j].state = TemplateState.FAILD;
                }
              },
              error => {
                if (this.configMapTpls &&
                  this.configMapTpls[i] &&
                  this.configMapTpls[i].status &&
                  this.configMapTpls[i].status[j]) {
                  this.configMapTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.configMapTpls[i].status[j].errNum} 次`);
                  if (this.configMapTpls[i].status[j].errNum === 3) {
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

  onlineChange() {
    this.retrieve();
  }

  ngAfterContentInit() {
    this.initConfigMap();
  }

  initConfigMap(refreshTpl?: boolean) {
    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    this.configMapId = parseInt(this.route.snapshot.params['configMapId'], 10);
    combineLatest(
      this.configMapService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', appId + ''),
      this.appService.getById(appId, namespaceId)
    ).subscribe(
      response => {
        this.configMaps = response[0].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.configMaps);
        this.configMapId = this.getConfigMapId(this.configMapId);
        this.app = response[1].data;
        if (refreshTpl) {
          this.retrieve();
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  getConfigMapId(configMapId: number): number {
    if (this.configMaps && this.configMaps.length > 0) {
      if (!configMapId) {
        return this.configMaps[0].id;
      }
      for (const c of this.configMaps) {
        if (configMapId === c.id) {
          return configMapId;
        }
      }
      return this.configMaps[0].id;
    } else {
      return null;
    }
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.CONFIGMAP, this.configMapId);
  }

  tabClick(id: number) {
    if (id) {
      this.configMapId = id;
      this.retrieve();
    }
  }

  cloneConfigMapTpl(tpl: ConfigMapTpl) {
    if (tpl) {
      this.router.navigate([
        `portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/configmap/${this.configMapId}/tpl/${tpl.id}`]);
    }
  }

  createConfigMapTpl() {
    this.router.navigate([
      `portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/configmap/${this.configMapId}/tpl`]);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscription.unsubscribe();
    this.tabScription.unsubscribe();
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.configMapId) {
      return;
    }
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    this.pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      this.configMapTplService.listPage(this.pageState, this.app.id, this.configMapId.toString()),
      this.publishService.listStatus(PublishType.CONFIGMAP, this.configMapId)
    ).subscribe(
      response => {
        const status = response[1].data;
        this.publishStatus = status;
        const tplStatusMap = {};
        if (status && status.length > 0) {
          for (const statu of status) {
            if (!tplStatusMap[statu.templateId]) {
              tplStatusMap[statu.templateId] = Array<PublishStatus>();
            }
            statu.errNum = 0;
            tplStatusMap[statu.templateId].push(statu);
          }
        }
        this.tplStatusMap = tplStatusMap;

        const tpls = response[0].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.buildTplList(tpls.list);
        this.configMapTpls = tpls.list;
        this.syncStatus();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  buildTplList(configMapTpls: ConfigMapTpl[]) {
    if (configMapTpls) {
      for (const configMapTpl of configMapTpls) {
        const metaData = configMapTpl.metaData ? configMapTpl.metaData : '{}';
        configMapTpl.clusters = JSON.parse(metaData).clusters;

        const publishStatus = this.tplStatusMap[configMapTpl.id];
        if (publishStatus && publishStatus.length > 0) {
          configMapTpl.status = publishStatus;
        }
      }
    }
  }

  retrieveConfigMap() {
    this.configMapService.list(PageState.fromState({
      sort: {
        by: 'id',
        reverse: false
      }
    }, {pageSize: 1000}), 'false', this.app.id + '').subscribe(
      response => {
        this.configMaps = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.configMaps);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  deleteConfigMap() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线配置集无法删除，请先下线配置集！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除配置集确认',
        '是否确认删除配置集?',
        this.configMapId,
        ConfirmationTargets.CONFIGMAP,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  createConfigMap(id: number) {
    if (id) {
      this.configMapId = id;
      this.retrieveConfigMap();
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditResource(this.app, []);
  }


  editConfigMap() {
    this.createEdit.newOrEditResource(this.app, [], this.configMapId);
  }
}
