import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets, PublishType } from '../../shared/shared.const';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { combineLatest } from 'rxjs';
import { AppService } from '../../shared/client/v1/app.service';
import { App } from '../../shared/model/v1/app';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { AuthService } from '../../shared/auth/auth.service';
import { ListPersistentVolumeClaimComponent } from './list-persistentvolumeclaim/list-persistentvolumeclaim.component';
import { CreateEditPersistentVolumeClaimComponent } from './create-edit-persistentvolumeclaim/create-edit-persistentvolumeclaim.component';
import { PersistentVolumeClaimService } from '../../shared/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaimTplService } from '../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaim } from '../../shared/model/v1/persistentvolumeclaim';
import { PersistentVolumeClaimClient } from '../../shared/client/v1/kubernetes/persistentvolumeclaims';
import { PublishService } from '../../shared/client/v1/publish.service';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { PageState } from '../../shared/page/page-state';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { OrderItem } from '../../shared/model/v1/order';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wayne-persistentvolumeclaim',
  templateUrl: './persistentvolumeclaim.component.html',
  styleUrls: ['./persistentvolumeclaim.component.scss']
})
export class PersistentVolumeClaimComponent implements OnInit, OnDestroy {
  @ViewChild(ListPersistentVolumeClaimComponent, { static: false })
  list: ListPersistentVolumeClaimComponent;
  @ViewChild(CreateEditPersistentVolumeClaimComponent, { static: false })
  createEdit: CreateEditPersistentVolumeClaimComponent;
  pvcId: number;
  pvcs: PersistentVolumeClaim[];
  app: App;
  appId: number;
  publishStatus: PublishStatus[];
  subscription: Subscription;
  tabScription: Subscription;
  orderCache: Array<OrderItem>;
  isOnline = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private publishService: PublishService,
              private deletionDialogService: ConfirmationDialogService,
              private publishHistoryService: PublishHistoryService,
              public cacheService: CacheService,
              private appService: AppService,
              private pvcClient: PersistentVolumeClaimClient,
              private pvcService: PersistentVolumeClaimService,
              public authService: AuthService,
              private tabDragService: TabDragService,
              private el: ElementRef,
              private pvcTplService: PersistentVolumeClaimTplService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
    this.tabScription = this.tabDragService.tabDragOverObservable.subscribe(over => {
      if (over) { this.tabChange(); }
    });
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM) {
        const pvcId = message.data;
        this.pvcService.deleteById(pvcId, this.app.id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('PVC删除成功！');
              this.router.navigate(['portal', 'namespace', this.cacheService.namespaceId, 'app',  this.app.id, 'persistentvolumeclaim']);
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });

  }

  diffTpl() {
    this.pvcService.diff();
  }

  onlineChange() {
    // 这里后台需要支持
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    let pvcId = parseInt(this.route.snapshot.params['pvcId'], 10);
    const pageState = PageState.fromState({ sort: { by: 'id', reverse: false } }, { pageSize: 1000 });
    pageState.params['isOnline'] = this.isOnline;
    combineLatest(
      [this.pvcService.list(pageState, 'false', this.appId + ''),
      this.appService.getById(this.appId, namespaceId)]
    ).subscribe(
      response => {
        this.pvcs = response[0].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.pvcs);
        this.app = response[1].data;
        pvcId = this.getPvcId(pvcId);
        if (pvcId) {
          this.pvcId = pvcId;
          if (this.router.url.indexOf('status') === -1) {
            this.navigateToList(this.app.id, pvcId);
          }

          this.publishService.listStatus(PublishType.PERSISTENT_VOLUME_CLAIM, this.pvcId).subscribe(
            next => {
              this.publishStatus = next.data;
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
        }
        // this.navigateToList(this.app.id, this.pvcId);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  ngOnDestroy() {
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
    this.pvcService.updateOrder(this.app.id, orderList).subscribe(
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

  initOrder(deployments?: PersistentVolumeClaim[]) {
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

  updatePvcs(): void {
    combineLatest(
      [this.pvcService.list(PageState.fromState({sort: {by: 'id', reverse: false}}, {pageSize: 1000}), 'false', this.appId + '')]
    ).subscribe(
      response => {
        this.pvcs = response[0].data.list.sort((a, b) => a.order - b.order);
        this.initOrder(this.pvcs);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  getPvcId(pvcId: number): number {
    if (this.pvcs && this.pvcs.length > 0) {
      if (!pvcId) {
        return this.pvcs[0].id;
      }
      for (const pvc of this.pvcs) {
        if (pvcId === pvc.id) {
          return pvcId;
        }
      }
      return this.pvcs[0].id;
    } else {
      return null;
    }
  }

  navigateToList(appId: number, pvdId: number) {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${appId}/persistentvolumeclaim/${pvdId}/list`]);
  }


  publishHistory() {
    this.publishHistoryService.openModal(PublishType.PERSISTENT_VOLUME_CLAIM, this.pvcId);
  }

  tabClick(id: number) {
    if (id) {
      this.pvcId = id;
      this.updatePvcs();
      this.navigateToList(this.app.id, id);
    }
  }

  createPvcTpl() {
    this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/persistentvolumeclaim/${this.pvcId}/tpl`]);
  }

  createPvc(id: number) {
    if (id) {
      this.updatePvcs();
      this.navigateToList(this.app.id, id);
    }
  }

  deletePvc() {
    if (this.publishStatus && this.publishStatus.length > 0) {
      this.messageHandlerService.warning('已上线PVC无法删除，请先下线PVC！');
    } else {
      const deletionMessage = new ConfirmationMessage(
        '删除PVC确认',
        '是否确认删除PVC?',
        this.pvcId,
        ConfirmationTargets.PERSISTENT_VOLUME_CLAIM,
        ConfirmationButtons.DELETE_CANCEL
      );
      this.deletionDialogService.openComfirmDialog(deletionMessage);
    }
  }

  openModal(): void {
    this.createEdit.newOrEditResource(this.app, []);
  }

  editPvc() {
    this.createEdit.newOrEditResource(this.app, [], this.pvcId);
  }
}
