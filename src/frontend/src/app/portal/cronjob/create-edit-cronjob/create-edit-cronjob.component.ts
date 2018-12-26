import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, configKeyApiNameGenerateRule } from '../../../shared/shared.const';
import 'rxjs/add/observable/combineLatest';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterMeta, Cronjob } from '../../../shared/model/v1/cronjob';
import { CronjobService } from '../../../shared/client/v1/cronjob.service';
import { App } from '../../../shared/model/v1/app';
import { AuthService } from '../../../shared/auth/auth.service';
import { ApiNameGenerateRule } from '../../../shared/utils';
import { ResourceLimitComponent } from '../../../shared/component/resource-limit/resource-limit.component';
@Component({
  selector: 'create-edit-cronjob',
  templateUrl: 'create-edit-cronjob.component.html',
  styleUrls: ['create-edit-cronjob.scss']
})

export class CreateEditCronjobComponent implements OnInit {
  cronjobForm: NgForm;
  @ViewChild('cronjobForm')
  currentForm: NgForm;
  @ViewChild(ResourceLimitComponent)
  resourceLimitComponent: ResourceLimitComponent;
  clusters: Cluster[];
  clusterMetas: {};
  title: string;
  cronjob: Cronjob = new Cronjob();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  actionType: ActionType;
  modalOpened: boolean;
  app: App;
  componentName = '计划任务';

  @Output() create = new EventEmitter<number>();

  constructor(
    private cronjobService: CronjobService,
    private authService: AuthService,
    private messageHandlerService: MessageHandlerService
  ) {
  }

  newOrEditCronjob(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.currentForm.reset();
    this.clusters = clusters;
    this.clusterMetas = {};
    if (this.clusters && this.clusters.length > 0) {
      for (let clu of this.clusters) {
        this.clusterMetas[clu.name] = new ClusterMeta(false);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑' + this.componentName;
      this.cronjobService.getById(id, this.app.id).subscribe(
        status => {
          this.cronjob = status.data;
          if (this.clusters && this.clusters.length > 0) {
            const replicas = JSON.parse(this.cronjob.metaData)['replicas'];
            for (const clu of this.clusters) {
              const culsterMeta = new ClusterMeta(false);
              if (replicas && replicas[clu.name]) {
                culsterMeta.checked = true;
                // culsterMeta.value = replicas[clu.name];
              } else {
                culsterMeta.checked = false;
              }
              // 目前限制数量为1
              culsterMeta.value = 1;
              this.clusterMetas[clu.name] = culsterMeta;
            }
          }
          this.resourceLimitComponent.setValue(JSON.parse(this.cronjob.metaData)['resources']);
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建' + this.componentName;
      this.cronjob = new Cronjob();
      for (const clu of this.clusters) {
        const culsterMeta = new ClusterMeta(false);
        culsterMeta.checked = false;
        // 目前限制数量为1
        culsterMeta.value = 1;
        this.clusterMetas[clu.name] = culsterMeta;
      }
      this.cronjob.metaData = '{}';
      this.resourceLimitComponent.setValue();
    }
  }

  ngOnInit(): void {
  }


  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  get nameGenerateRuleConfig(): string {
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData);
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.cronjob.appId = this.app.id;

    let replicas = {};
    let suspends = {};
    for (let clu of this.clusters) {
      let clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        replicas[clu.name] = clusterMeta.value;
        suspends[clu.name] = false;
      }
    }
    if (!this.cronjob.metaData) {
      this.cronjob.metaData = '{}';
    }
    let metaData = JSON.parse(this.cronjob.metaData);
    metaData.replicas = replicas;
    metaData.suspends = suspends;
    metaData.resources = this.resourceLimitComponent.getValue();
    if (!metaData.successfulJobsHistoryLimit) {
      metaData.successfulJobsHistoryLimit = 3;
    }
    if (!metaData.failedJobsHistoryLimit) {
      metaData.failedJobsHistoryLimit = 3;
    }
    this.cronjob.metaData = JSON.stringify(metaData);
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.cronjob.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.cronjob.name, this.app.name);
        this.cronjobService.create(this.cronjob).subscribe(
          response => {
            this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
            this.create.emit(response.data.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.cronjobService.update(this.cronjob).subscribe(
          response => {
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
            this.create.emit(this.cronjob.id);
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

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing &&
      this.isClusterValid();
  }

  isClusterValid(): boolean {
    if (this.clusters) {
      for (let clu of this.clusters) {
        let clusterMeta = this.clusterMetas[clu.name];
        if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
          return true;
        }
      }
    }
    return false;
  }

  handleValidation(): void {
    let cont = this.currentForm.controls['cronjob_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}
