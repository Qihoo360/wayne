import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Resource } from 'wayne-component/lib/base/resource/resource';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDragService } from 'wayne-component/lib/client/v1/tab-drag.service';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { PublishService } from 'wayne-component/lib/client/v1/publish.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { AppService } from 'wayne-component/lib/client/v1/app.service';
import { PublishHistoryService } from '../common/publish-history/publish-history.service';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { AutoscaleTplService } from 'wayne-component/lib/client/v1/autoscaletpl.service';
import { AutoscaleClient } from 'wayne-component/lib/client/v1/kubernetes/autoscale';
import { CreateEditAutoscaleComponent } from './create-edit-autoscale/create-edit-autoscale.component';
import { ConfirmationTargets, KubeResourceHorizontalPodAutoscaler, PublishType } from 'wayne-component/lib/shared.const';
import { HorizontalPodAutoscaler } from 'wayne-component/lib/model/v1/kubernetes/autoscale';
import { PublishStatus } from 'wayne-component/lib/model/v1/publish-status';
import { ListAutoscaleComponent } from './list-autoscale/list-autoscale.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';

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
