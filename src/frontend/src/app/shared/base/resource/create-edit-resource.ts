import { App } from '../../model/v1/app';
import { ActionType, configKeyApiNameGenerateRule, defaultResources } from '../../shared.const';
import { NgForm } from '@angular/forms';
import { EventEmitter, Output, ViewChild } from '@angular/core';
import { Cluster, ClusterMeta } from '../../model/v1/cluster';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { AuthService } from '../../auth/auth.service';
import { ApiNameGenerateRule } from '../../utils';
import { Resources } from '../../model/v1/resources-limit';

export class CreateEditResource {
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;
  clusters: Cluster[];
  resourcesMetas = new Resources();
  title: string;
  resource: any;
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;
  actionType: ActionType;
  modalOpened: boolean;
  app: App;
  clusterMetas: {};
  initResource: any;
  // 限制机房数量, 用于只是机房勾选
  defaultClusterNum = 1;
  resourceType: string;

  @Output() create = new EventEmitter<number>();

  constructor(public resourceService: any,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
  }

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  registResource(resource: any) {
    this.initResource = resource;
    this.resetResource(resource);
  }

  resetResource(resource: any) {
    this.resource = Object.assign({}, resource);
  }

  setMetaData() {
    this.resource.metaData = this.resource.metaData ? this.resource.metaData : '{}';
    const metaData = JSON.parse(this.resource.metaData);
    if (this.clusters && this.clusters.length > 0) {
      if (metaData['clusters']) {
        for (const cluster of metaData['clusters']) {
          for (let i = 0; i < this.clusters.length; i++) {
            if (cluster === this.clusters[i].name) {
              this.clusterMetas[cluster] = new ClusterMeta(true, this.defaultClusterNum);
            }
          }
        }
      }
    }
  }

  initMetaData(): void {
    this.resource.metaData = '{}';
  }

  newOrEditResource(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.isNameValid = true;
    this.clusters = clusters;
    this.clusterMetas = {};
    this.resetResource(this.initResource);
    if (this.clusters && this.clusters.length > 0) {
      for (const clu of this.clusters) {
        this.clusterMetas[clu.name] = new ClusterMeta(false, this.defaultClusterNum);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = `编辑${this.resourceType}`;
      this.resourceService.getById(id, app.id).subscribe(
        status => {
          this.resource = status.data;
          this.setMetaData();
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = `创建${this.resourceType}`;
      this.initMetaData();
    }
  }

  checkNameValid(): void {
    const cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }


  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  formatMetaData() {
    // 没有 replicas 参数，添加一个 cluster 的机房数组。
    if (!this.resource.metaData) {
      this.resource.metaData = '{}';
    }
    const metaData = JSON.parse(this.resource.metaData);
    const clusters = [];
    for (const clu of this.clusters) {
      const clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        clusters.push(clu.name);
      }
    }
    metaData.clusters = clusters;
    this.resource.metaData = JSON.stringify(metaData);
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.resource.appId = this.app.id;
    this.formatMetaData();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.resource.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.resource.name, this.app.name);
        this.resourceService.create(this.resource).subscribe(
          response => {
            this.messageHandlerService.showSuccess('创建' + this.resourceType + '成功！');
            this.create.emit(response.data.id);
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.resourceService.update(this.resource).subscribe(
          response => {
            this.messageHandlerService.showSuccess('更新' + this.resourceType + '成功！');
            this.create.emit(this.resource.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
    }
    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  get nameGenerateRuleConfig(): string {
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData);
  }

  isClusterValid(): boolean {
    if (this.clusters) {
      for (const clu of this.clusters) {
        const clusterMeta = this.clusterMetas[clu.name];
        if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
          return true;
        }
      }
    }
    return false;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing &&
      this.isClusterValid();
  }
}
