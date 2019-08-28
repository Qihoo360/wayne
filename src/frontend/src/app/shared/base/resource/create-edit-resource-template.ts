import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { App } from '../../model/v1/app';
import { ActionType, appLabelKey, namespaceLabelKey } from '../../shared.const';
import { Location } from '@angular/common';
import { AppService } from '../../client/v1/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AceEditorService } from '../../ace-editor/ace-editor.service';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { CacheService } from '../../auth/cache.service';
import { AceEditorMsg } from '../../ace-editor/ace-editor';
import { mergeDeep } from '../../utils';
import { ObjectMeta } from '../../model/v1/kubernetes/base';

export class CreateEditResourceTemplate {
  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
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



  constructor(
    public templateService: any,
    public resourceService: any,
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

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  registDefaultKubeResource(kubeResource: any) {
    this.defaultKubeResource = kubeResource;
  }

  // 监听退出事件
  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  // 监听提交表单的事件
  onSubmit() {
    // TODO 后续重构可以通过修改类型字段的形式实现该函数的抽象，暂时无法提炼通用
  }

  // 监听打开 Modal
  onOpenModal(): void {
    let resourceObj = JSON.parse(JSON.stringify(this.kubeResource));
    resourceObj = this.generateResource(resourceObj);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(resourceObj, true));
  }

  // 处理资源（挂载系统 label 等）
  generateResource(kubeResource: any): any {
    kubeResource.metadata.name = this.resource.name;
    kubeResource.metadata.labels = this.generateLabels(this.kubeResource.metadata.labels);
    return kubeResource;
  }

  // 处理系统定义的 label
  generateLabels(labels: {}) {
    if (!labels) {
      labels = {};
    }
    labels[this.authService.config[appLabelKey]] = this.app.name;
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.resource.name;
    return labels;
  }

  saveResourceTemplate(template?: any) {
    if (!template) {
      template = this.template.template;
    }
    this.removeUnused(template);
    this.kubeResource = mergeDeep(JSON.parse(this.defaultKubeResource), template);
  }

  // remove unused fields, deal with user advanced mode paste yaml/json manually
  removeUnused(obj: any) {
    const metaData = new ObjectMeta();
    metaData.name = obj.metadata.name;
    metaData.namespace = obj.metadata.namespace;
    metaData.labels = obj.metadata.labels;
    metaData.annotations = obj.metadata.annotations;
    obj.metadata = metaData;
    obj.status = undefined;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing && this.isValidResource();
  }

  isValidResource(): boolean {
    if (this.kubeResource == null) {
      return false;
    }
    return true;
  }
}
