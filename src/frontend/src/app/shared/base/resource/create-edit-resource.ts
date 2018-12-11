import { App } from '../../model/v1/app';
import { ActionType, configKeyApiNameGenerateRule, defaultResources } from '../../shared.const';
import { NgForm } from '@angular/forms';
import { EventEmitter, Output, ViewChild } from '@angular/core';
import { Cluster } from '../../model/v1/cluster';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { AuthService } from '../../auth/auth.service';
import { ApiNameGenerateRule } from '../../utils';
import { Resources } from '../../model/v1/resources-limit';

export class CreateEditResource {
  ngForm: NgForm;
  @ViewChild('ngForm')
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
    this.resource = resource;
  }

  newOrEditResource(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.isNameValid = true;
    this.clusters = clusters;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑' + this.resourceType;
      this.resourceService.getById(id, app.id).subscribe(
        status => {
          this.resource = status.data;
          if (!status.data.metaData) {
            status.metaData = '{}';
          }
          const clusterMetas = JSON.parse(status.data.metaData);
          if (clusterMetas['clusters']) {
            for (const cluster of clusterMetas['clusters']) {
              for (let i = 0; i < this.clusters.length; i++) {
                if (cluster === this.clusters[i].name) {
                  this.clusters[i].checked = true;
                }
              }
            }
          }
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建' + this.resourceType;
      this.resourcesMetas = Object.assign({}, defaultResources);
      this.resource.metaData = '{}';
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

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.resource.appId = this.app.id;
    const metaData = JSON.parse(this.resource.metaData);
    const checkedCluster = Array<string>();
    this.clusters.map(cluster => {
      if (cluster.checked) {
        checkedCluster.push(cluster.name);
      }
    });
    metaData['clusters'] = checkedCluster;
    this.resource.metaData = JSON.stringify(metaData);
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


  public get isValidForm(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }
}
