import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { App } from '../../app/shared/model/v1/app';
import { ActionType, appLabelKey, namespaceLabelKey } from '../../app/shared/shared.const';
import { Location } from '@angular/common';
import { AppService } from '../../app/shared/client/v1/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../app/shared/auth/auth.service';
import { AceEditorService } from '../../app/shared/ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../app/shared/message-handler/message-handler.service';
import { CacheService } from '../../app/shared/auth/cache.service';
import { AceEditorMsg } from '../../app/shared/ace-editor/ace-editor';
import { mergeDeep } from '../../app/shared/utils';

export class CreateEditResourceTemplate {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;


  checkOnGoing = false;
  isSubmitOnGoing = false;
  actionType: ActionType;
  app: App;

  template: any;
  resource: any;
  kubeResource: any;
  defaultKubeResource: any;

  resourceType: string;
  message: string;



  constructor(
    private templateService: any,
    private resourceService: any,
    public location: Location,
    public router: Router,
    public appService: AppService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public cacheService: CacheService,
    public aceEditorService: AceEditorService,
    public messageHandlerService: MessageHandlerService
  ) {
  }

  setResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  setDefaultKubeResource(kubeResource: any) {
    this.defaultKubeResource = kubeResource;
  }

  setMessage(message: string) {
    this.message = message;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing && this.isValidResource();
  }


  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    let resourceObj = JSON.parse(JSON.stringify(this.kubeResource));
    resourceObj = this.generateResource(resourceObj);
    this.template.ingressId = this.resource.id;
    this.template.template = JSON.stringify(resourceObj);

    this.template.id = undefined;
    this.template.name = this.resource.name;
    this.templateService.create(this.template, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.router.navigate(
          [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resource.id}`]
        );
        // TODO 路由变化后下面不会生效
        this.messageHandlerService.showSuccess(this.message);
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);

      }
    );
  }

  openModal(): void {
    let resourceObj = JSON.parse(JSON.stringify(this.kubeResource));
    resourceObj = this.generateResource(resourceObj);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(resourceObj, true));
  }

  generateResource(kubeResource: any): any {
    kubeResource.metadata.name = this.resource.name;
    kubeResource.metadata.labels = this.generateLabels(this.kubeResource.metadata.labels);
    return kubeResource;
  }

  generateLabels(labels: {}) {
    if (!labels) {
      labels = {};
    }
    labels[this.authService.config[appLabelKey]] = this.app.name;
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.resource.name;
    return labels;
  }

  saveResourceTemplate() {
    this.kubeResource = mergeDeep(JSON.parse(this.defaultKubeResource), JSON.parse( this.template.template));
  }

  isValidResource(): boolean {
    if (this.kubeResource === null) {
      return false;
    }
    return true;
  }
}
