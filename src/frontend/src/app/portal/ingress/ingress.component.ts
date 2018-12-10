import { OnInit, ChangeDetectorRef, Component, OnDestroy, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditIngressComponent } from './create-edit-ingress/create-edit-ingress.component';
import { Observable } from 'rxjs/Observable';
import { State } from '@clr/angular';
import { App } from '../../shared/model/v1/app';
import { Cluster } from '../../shared/model/v1/cluster';
import { Ingress } from '../../shared/model/v1/ingress';
import { IngressService } from '../../shared/client/v1/ingress.service';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets, httpStatusCode,
  PublishType, TemplateState,
} from '../../shared/shared.const';
import { AuthService } from '../../shared/auth/auth.service';
import { PublishService } from '../../shared/client/v1/publish.service';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../shared/page/page-state';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { OrderItem } from '../../shared/model/v1/order';
import { ListIngressComponent } from './list-ingress/list-ingress.component';
import { IngressTplService } from '../../shared/client/v1/ingresstpl.service';
import { IngressTpl } from '../../shared/model/v1/ingresstpl';
import { IngressStatus, KubeIngress } from '../../shared/model/v1/kubernetes/ingress';
import { IngressClient } from '../../shared/client/v1/kubernetes/ingress';
import { Resource } from '../../../packages/kubernetes/resource';

const showState = {
  '创建时间': {hidden: false},
  '上线机房': {hidden: false},
  '发布说明': {hidden: false},
  '创建者': {hidden: false},
  '操作': {hidden: false}
};

@Component({
  selector: 'wayne-ingress',
  templateUrl: './ingress.component.html',
  styleUrls: ['./ingress.component.scss']
})
export class IngressComponent extends Resource implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild(CreateEditIngressComponent)
  createEditResource: CreateEditIngressComponent;
  @ViewChild(ListIngressComponent)
  listResourceComponent: ListIngressComponent;

  constructor(public ingressService: IngressService,
              public ingressTplService: IngressTplService,
              public ingressClient: IngressClient,
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
    super(
      ingressService,
      ingressTplService,
      ingressClient,
      publishHistoryService,
      route,
      router,
      publishService,
      cacheService,
      authService,
      cdr,
      appService,
      deletionDialogService,
      clusterService,
      tabDragService,
      el,
      messageHandlerService
    )
    super.setResourceType('ingress');
    super.registPublishType(PublishType.INGRESS);
    super.registSubscription(ConfirmationTargets.INGRESS, 'ingress 删除成功！');
    super.registConfirmationTarget(ConfirmationTargets.INGRESS);
  }

  ngOnInit() {
    this.initShow();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscription.unsubscribe();
    this.tabScription.unsubscribe();
  }

  ngAfterContentInit() {
    this.initResource();
  }
}
