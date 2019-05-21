import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  httpStatusCode,
  KubeResourceSecret,
  PublishType,
  syncStatusInterval,
  TemplateState
} from '../../shared/shared.const';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListSecretComponent } from './list-secret/list-secret.component';
import { CreateEditSecretComponent } from './create-edit-secret/create-edit-secret.component';
import { combineLatest } from 'rxjs';
import { SecretClient } from '../../shared/client/v1/kubernetes/secret';
import { AppService } from '../../shared/client/v1/app.service';
import { SecretService } from '../../shared/client/v1/secret.service';
import { SecretTplService } from '../../shared/client/v1/secrettpl.service';
import { Secret } from '../../shared/model/v1/secret';
import { SecretTpl } from '../../shared/model/v1/secrettpl';
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
  selector: 'wayne-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild(ListSecretComponent)
  list: ListSecretComponent;
  @ViewChild(CreateEditSecretComponent)
  createEdit: CreateEditSecretComponent;
  secretId: number;
  pageState: PageState = new PageState();
  isOnline = false;
  secrets: Secret[];
  secretTpls: SecretTpl[];
  app: App;
  appId: number;
  timer: any = null;
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
              private appService: AppService,
              private secretClient: SecretClient,
              private kubernetesClient: KubernetesClient,
              private publishHistoryService: PublishHistoryService,
              public authService: AuthService,
              private deletionDialogService: ConfirmationDialogService,
              public cacheService: CacheService,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private secretService: SecretService,
              private secretTplService: SecretTplService,
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
        message.source === ConfirmationTargets.SECRET) {
        const secretId = message.data;
        this.secretService.deleteById(secretId, this.app.id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('加密字典删除成功！');
              this.secretId = null;
              this.initSecret(true);
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
    this.secretService.updateOrder(this.app.id, orderList).subscribe(
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

  initOrder(deployments?: Secret[]) {
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

  periodSyncStatus() {
    this.timer = setInterval(() => {
      this.syncStatus();
    }, syncStatusInterval);
  }

  syncStatus(): void {
    if (this.secretTpls && this.secretTpls.length > 0) {
      for (let i = 0; i < this.secretTpls.length; i++) {
        const tpl = this.secretTpls[i];
        if (tpl.status && tpl.status.length > 0) {
          for (let j = 0; j < tpl.status.length; j++) {
            const status = tpl.status[j];
            if (status.errNum > 2) {
              continue;
            }
            this.kubernetesClient.get(status.cluster, KubeResourceSecret, tpl.name,
              this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
              response => {
                const code = response.statusCode || response.status;
                if (code === httpStatusCode.NoContent) {
                  this.secretTpls[i].status[j].state = TemplateState.NOT_FOUND;
                  return;
                }
                if (response.data &&
                  this.secretTpls &&
                  this.secretTpls[i] &&
                  this.secretTpls[i].status &&
                  this.secretTpls[i].status[j]) {
                  this.secretTpls[i].status[j].state = TemplateState.SUCCESS;
                } else {
                  this.secretTpls[i].status[j].state = TemplateState.FAILD;
                }
              },
              error => {
                if (this.secretTpls &&
                  this.secretTpls[i] &&
                  this.secretTpls[i].status &&
                  this.secretTpls[i].status[j]) {
                  this.secretTpls[i].status[j].errNum += 1;
                  this.messageHandlerService.showError(`${status.cluster}请求错误次数 ${this.secretTpls[i].status[j].errNum} 次`);
                  if (this.secretTpls[i].status[j].errNum === 3) {
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

  ngAfterContentInit() {
    this.initSecret();
  }

  initSecret(refreshTpl?: boolean) {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    this.secretId = parseInt(this.route.snapshot.params['secretId'], 10);
    const namespaceId = this.cacheService.namespaceId;
    combineLatest(
      this.secretService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + ''),
      this.appService.getById(this.appId, namespaceId)
    ).subscribe(
      response => {
        this.secrets = response[0].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.secrets);
        this.secretId = this.getSecretId(this.secretId);
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

  getSecretId(secretId: number): number {
    if (this.secrets && this.secrets.length > 0) {
      if (!secretId) {
        return this.secrets[0].id;
      }
      for (const c of this.secrets) {
        if (secretId === c.id) {
          return secretId;
        }
      }
      return this.secrets[0].id;
    } else {
      return null;
    }
  }

  tabClick(id: number) {
    if (id) {
      this.secretId = id;
      this.retrieve();
    }
  }

  publishHistory() {
    this.publishHistoryService.openModal(PublishType.SECRET, this.secretId);
  }

  cloneSecretTpl(tpl: SecretTpl) {
    if (tpl) {
      this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/secret/${this.secretId}/tpl/${tpl.id}`]);
    }
  }

  createSecretTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/secret/${this.secretId}/tpl`]);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscription.unsubscribe();
    this.tabScription.unsubscribe();
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (!this.secretId) {
      return;
    }
    if (state) {
      this.pageState = PageState.fromState(state,
        {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.pageState.params['deleted'] = false;
    this.pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      this.secretTplService.listPage(this.pageState, this.app.id, this.secretId.toString()),
      this.publishService.listStatus(PublishType.SECRET, this.secretId)
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
            stat.errNum = 0;
            tplStatusMap[stat.templateId].push(stat);
          }
        }
        this.tplStatusMap = tplStatusMap;

        const tpls = response[0].data;
        this.pageState.page.totalPage = tpls.totalPage;
        this.pageState.page.totalCount = tpls.totalCount;
        this.buildTplList(tpls.list);
        this.secretTpls = tpls.list;
        this.syncStatus();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  deleteSecret() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线加密字典无法删除，请先下线加密字典！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除加密字典确认',
        '是否确认删除加密字典?',
        this.secretId,
        ConfirmationTargets.SECRET,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  buildTplList(tpls: SecretTpl[]) {
    if (tpls) {
      for (const tpl of tpls) {
        const metaData = tpl.metaData ? tpl.metaData : '{}';
        tpl.clusters = JSON.parse(metaData).clusters;

        const publishStatus = this.tplStatusMap[tpl.id];
        if (publishStatus && publishStatus.length > 0) {
          tpl.status = publishStatus;
        }
      }
    }
  }

  retrieveSecret() {
    this.secretService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + '').subscribe(
      response => {
        this.secrets = response.data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.secrets);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  createSecret(id: number) {
    if (id) {
      this.secretId = id;
      this.retrieveSecret();
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditResource(this.app, []);
  }

  editSecret() {
    this.createEdit.newOrEditResource(this.app, [], this.secretId);
  }
}
