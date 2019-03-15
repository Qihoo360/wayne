import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Resource } from '../../shared/base/resource/resource';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDragService } from '../../shared/client/v1/tab-drag.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { PublishService } from '../../shared/client/v1/publish.service';
import { AuthService } from '../../shared/auth/auth.service';
import { AppService } from '../../shared/client/v1/app.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { CacheService } from '../../shared/auth/cache.service';
import { AutoscaleService } from '../../shared/client/v1/autoscale.service';
import { AutoscaleTplService } from '../../shared/client/v1/autoscaletpl.service';
import { AutoscaleClient } from '../../shared/client/v1/kubernetes/autoscale';
import { CreateEditAutoscaleComponent } from './create-edit-autoscale/create-edit-autoscale.component';
import { ConfirmationTargets, KubeResourceHorizontalPodAutoscaler, PublishType } from '../../shared/shared.const';
import { HorizontalPodAutoscaler } from '../../shared/model/v1/kubernetes/autoscale';
import { PublishStatus } from '../../shared/model/v1/publish-status';
import { ListAutoscaleComponent } from './list-autoscale/list-autoscale.component';
import { KubernetesClient } from '../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'wayne-autoscale',
  templateUrl: './autoscale.component.html',
  styleUrls: ['./autoscale.component.scss']
})
export class AutoscaleComponent extends Resource implements OnInit, AfterContentInit {
  @ViewChild(CreateEditAutoscaleComponent)
  createEditResourceComponent: CreateEditAutoscaleComponent;
  @ViewChild(ListAutoscaleComponent)
  listResourceComponent: ListAutoscaleComponent;

  constructor(public autoscaleService: AutoscaleService,
              public autoscaleTplService: AutoscaleTplService,
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
      autoscaleService,
      autoscaleTplService,
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
    super.registResourceType('autoscale');
    super.registKubeResource(KubeResourceHorizontalPodAutoscaler);
    super.registPublishType(PublishType.AUTOSCALE);
    super.registConfirmationTarget(ConfirmationTargets.AUTOSCALE);
    super.registSubscription('autoscale 删除成功！');
    super.registShowState({
      'id': {hidden: false},
      'createTime': {hidden: false},
      'cluster': {hidden: false},
      'description': {hidden: false},
      'user': {hidden: false},
      'action': {hidden: false}
    });
  }

  ngOnInit() {
    this.initShow();
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
        const hpa: HorizontalPodAutoscaler = JSON.parse(templatedata[i].template);
        const publishStatus = tplStatusMap[templatedata[i].id];
        if (publishStatus && publishStatus.length > 0) {
          templatedata[i].status = publishStatus;
        }
      }
    }
    this.templates = templatedata;
  }

}
