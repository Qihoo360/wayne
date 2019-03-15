import { OnInit, ChangeDetectorRef, Component, OnDestroy, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditIngressComponent } from './create-edit-ingress/create-edit-ingress.component';
import { IngressService } from '../../shared/client/v1/ingress.service';
import { AppService } from '../../shared/client/v1/app.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { CacheService } from '../../shared/auth/cache.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import {
  ConfirmationTargets, KubeResourceIngress,
  PublishType,
} from '../../shared/shared.const';
import { AuthService } from '../../shared/auth/auth.service';
import { PublishService } from '../../shared/client/v1/publish.service';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { ListIngressComponent } from './list-ingress/list-ingress.component';
import { IngressTplService } from '../../shared/client/v1/ingresstpl.service';
import { KubeIngress } from '../../shared/model/v1/kubernetes/ingress';
import { IngressClient } from '../../shared/client/v1/kubernetes/ingress';
import { Resource } from '../../shared/base/resource/resource';
import { KubernetesClient } from '../../shared/client/v1/kubernetes/kubernetes';

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
  createEditResourceComponent: CreateEditIngressComponent;
  @ViewChild(ListIngressComponent)
  listResourceComponent: ListIngressComponent;

  constructor(public ingressService: IngressService,
              public ingressTplService: IngressTplService,
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
    super(
      ingressService,
      ingressTplService,
      kubernetesClient,
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
    );
    super.registKubeResource(KubeResourceIngress);
    super.registResourceType('ingress');
    super.registPublishType(PublishType.INGRESS);
    super.registConfirmationTarget(ConfirmationTargets.INGRESS);
    super.registSubscription( 'ingress 删除成功！');
    super.registShowState({
      '创建时间': {hidden: false},
      '上线机房': {hidden: false},
      '发布说明': {hidden: false},
      '创建者': {hidden: false},
      '操作': {hidden: false}
    });
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

  generateTemplateList(templatedata: any[], publishdata: any[]): void {
    const tplStatusMap = {};
    if (publishdata && publishdata.length > 0) {
      for (const state of publishdata) {
        if (!tplStatusMap[state.templateId]) {
          tplStatusMap[state.templateId] = Array<PublishStatus>();
        }
        state.errNum = 0;
        tplStatusMap[state.templateId].push(state);
      }
    }
    if (templatedata && templatedata.length > 0) {
      for (let i = 0; i < templatedata.length; i++) {
        const ing: KubeIngress = JSON.parse(templatedata[i].template);
        if (ing.spec.rules && ing.spec.rules.length > 0) {
          const publishStatus = tplStatusMap[templatedata[i].id];
          if (publishStatus && publishStatus.length > 0) {
            templatedata[i].status = publishStatus;
          }
        }
      }
    }
    this.templates = templatedata;
  }
}
