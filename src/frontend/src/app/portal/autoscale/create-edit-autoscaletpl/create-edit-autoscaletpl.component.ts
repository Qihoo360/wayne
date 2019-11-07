import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { AppService } from '../../../shared/client/v1/app.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { CreateEditResourceTemplate } from '../../../shared/base/resource/create-edit-resource-template';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { defaultAutoscale } from '../../../shared/default-models/autoscale.const';
import { DOCUMENT, Location } from '@angular/common';
import { ActionType } from '../../../shared/shared.const';
import { combineLatest } from 'rxjs';
import { EventManager } from '@angular/platform-browser';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AutoscaleTplService } from '../../../shared/client/v1/autoscaletpl.service';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { AutoscaleTpl } from '../../../shared/model/v1/autoscaletpl';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { Deployment } from '../../../shared/model/v1/deployment';

@Component({
  selector: 'wayne-create-edit-autoscaletpl',
  templateUrl: './create-edit-autoscaletpl.component.html',
  styleUrls: ['./create-edit-autoscaletpl.component.scss']
})
export class CreateEditAutoscaletplComponent extends CreateEditResourceTemplate implements OnInit, AfterViewInit, OnDestroy {
  actionType: ActionType;

  deploys: Deployment[];
  top: number;
  box: HTMLElement;
  eventList: any[] = Array();

  constructor(private autoscaleTplService: AutoscaleTplService,
              private autoscaleService: AutoscaleService,
              public location: Location,
              public router: Router,
              public deploymentService: DeploymentService,
              public appService: AppService,
              public route: ActivatedRoute,
              public authService: AuthService,
              public cacheService: CacheService,
              public aceEditorService: AceEditorService,
              @Inject(DOCUMENT) private document: any,
              private eventManager: EventManager,
              public messageHandlerService: MessageHandlerService) {
    super(
      autoscaleTplService,
      autoscaleService,
      location,
      router,
      appService,
      route,
      authService,
      cacheService,
      aceEditorService,
      messageHandlerService
    );
    super.registResourceType('autoscale');
    super.registDefaultKubeResource(defaultAutoscale);
    this.template = new AutoscaleTpl();
  }

  ngOnInit(): void {
    this.kubeResource = JSON.parse(this.defaultKubeResource);
    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const hpaId = parseInt(this.route.snapshot.params['resourceId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.appService.getById(appId, namespaceId),
      this.autoscaleService.getById(hpaId, appId),
      this.deploymentService.getNames(appId),
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.autoscaleTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.resource = response[1].data;
        this.deploys = response[2].data;
        const tpl = response[3];
        if (tpl) {
          this.template = tpl.data;
          this.template.description = null;
          this.saveResourceTemplate(JSON.parse(this.template.template));
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  ngAfterViewInit() {
    this.box = this.document.querySelector('.content-area');
    this.box.style.paddingBottom = '60px';
    this.eventList.push(
      this.eventManager.addEventListener(this.box, 'scroll', this.scrollEvent.bind(this, true)),
      this.eventManager.addGlobalEventListener('window', 'resize', this.scrollEvent.bind(this, false))
    );
    this.scrollEvent(false);
  }

  ngOnDestroy() {
    this.eventList.forEach(item => {
      item();
    });
    this.box.style.paddingBottom = '0.75rem';
  }

  scrollEvent(scroll: boolean, event?) {
    let top = 0;
    if (event && scroll) {
      top = event.target.scrollTop;
      this.top = top + this.box.offsetHeight - 48;
    } else {
      // hack
      setTimeout(() => {
        this.top = this.box.scrollTop + this.box.offsetHeight - 48;
      }, 0);
    }
  }

  isValidResource(): boolean {
    if (super.isValidResource() === false) {
      return false;
    }
    if (this.kubeResource.spec.minReplicas > this.kubeResource.spec.maxReplicas) {
      return false;
    }
    if (this.kubeResource.spec.targetCPUUtilizationPercentage <= 0) {
      return false;
    }
    if (this.kubeResource.spec.scaleTargetRef.name === '') {
      return false;
    }
    return true;
  }

  // 监听提交表单的事件
  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    let resourceObj = JSON.parse(JSON.stringify(this.kubeResource));
    resourceObj = this.generateResource(resourceObj);
    this.template.hpaId = this.resource.id;
    this.template.template = JSON.stringify(resourceObj);

    this.template.id = undefined;
    this.template.name = this.resource.name;
    this.template.createTime = this.template.updateTime = new Date();
    this.templateService.create(this.template, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.router.navigate(
          [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resource.id}`]
        );
        // TODO 路由变化后下面不会生效
        this.messageHandlerService.showSuccess('创建' + this.resourceType + '模板成功！');
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);

      }
    );
  }
}
