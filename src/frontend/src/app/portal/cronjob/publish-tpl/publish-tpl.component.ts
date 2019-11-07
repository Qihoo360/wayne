import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Cronjob } from '../../../shared/model/v1/cronjob';
import { ClusterMeta } from '../../../shared/model/v1/cluster';
import { CronjobStatus, CronjobTpl } from '../../../shared/model/v1/cronjobtpl';
import { KubeCronJob } from '../../../shared/model/v1/kubernetes/cronjob';
import { CacheService } from '../../../shared/auth/cache.service';
import { ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { CronjobClient } from '../../../shared/client/v1/kubernetes/cronjob';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishCronjobTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm', { static: true })
  currentForm: NgForm;

  cronjob: Cronjob;
  cronjobTpl: CronjobTpl;
  clusterMetas = {};
  clusters = Array<string>();
  isSubmitOnGoing = false;
  title: string;
  actionType: ResourcesActionType;
  forceOffline: boolean;
  componentName = '计划任务';

  constructor(private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private publishStatusService: PublishStatusService,
              private cronjobClient: CronjobClient) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }


  newPublishTpl(cronjob: Cronjob, cronjobTpl: CronjobTpl, actionType: ResourcesActionType) {
    const replicas = this.getReplicas(cronjob);
    this.actionType = actionType;
    this.forceOffline = false;
    if (replicas != null) {
      this.modalOpened = true;
      this.cronjob = cronjob;
      this.setTitle(actionType);
      this.cronjobTpl = cronjobTpl;
      this.clusters = Array<string>();
      this.clusterMetas = {};
      if (actionType === ResourcesActionType.OFFLINE || actionType === ResourcesActionType.UPDATE) {
        cronjobTpl.status.map(state => {
          this.clusters.push(state.cluster);
          this.clusterMetas[state.cluster] = new ClusterMeta(false);
        });
      } else if (actionType === ResourcesActionType.PUBLISH) {
        Object.getOwnPropertyNames(replicas).map(key => {
          if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[key]) {
            const clusterMeta = new ClusterMeta(false);
            // 发布数量固定为1
            // clusterMeta.value = replicas[key];
            clusterMeta.value = 1;
            this.clusterMetas[key] = clusterMeta;
            this.clusters.push(key);
          }
        });
      }

    }
  }

  setTitle(actionType: ResourcesActionType) {
    switch (actionType) {
      case ResourcesActionType.PUBLISH:
        this.title = '发布' + this.componentName + '[' + this.cronjob.name + ']';
        break;
      case ResourcesActionType.RESTART:
        this.title = '重启' + this.componentName + '[' + this.cronjob.name + ']';
        break;
      case ResourcesActionType.OFFLINE:
        this.title = '下线' + this.componentName + '[' + this.cronjob.name + ']';
        break;
      case ResourcesActionType.UPDATE:
        this.title = '挂起' + this.componentName + '[' + this.cronjob.name + ']';
        break;
    }
  }

  getStatusByCluster(status: CronjobStatus[], cluster: string): CronjobStatus {
    if (status && status.length > 0) {
      for (const state of status) {
        if (state.cluster === cluster) {
          return state;
        }
      }
    }
    return null;
  }

  getReplicas(cronjob: Cronjob): {} {
    if (!cronjob.metaData) {
      this.messageHandlerService.showWarning(this.componentName + '实例数未配置，请先到编辑' + this.componentName + '配置实例数！');
      return null;
    }
    const replicas = JSON.parse(cronjob.metaData)['replicas'];
    if (!replicas) {
      this.messageHandlerService.showWarning(this.componentName + '实例数未配置，请先到编辑' + this.componentName + '配置实例数！');
      return null;
    }
    return replicas;
  }

  onCancel() {
    this.currentForm.reset();
    this.modalOpened = false;
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    switch (this.actionType) {
      case ResourcesActionType.PUBLISH:
        this.deploy();
        break;
      case ResourcesActionType.RESTART:
        this.deploy();
        break;
      case ResourcesActionType.OFFLINE:
        this.offline();
        break;
      case ResourcesActionType.UPDATE:
        this.suspend();
        break;
    }

    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  offline() {
    Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
      if (this.clusterMetas[cluster].checked) {
        const data = this.getStatusByCluster(this.cronjobTpl.status, cluster);
        this.cronjobClient.deleteByName(this.appId, cluster, this.cacheService.kubeNamespace, this.cronjob.name).subscribe(
          response => {
            this.deletePublishStatus(data.id);
          },
          error => {
            if (this.forceOffline) {
              this.deletePublishStatus(data.id);
            } else {
              this.messageHandlerService.handleError(error);
            }
          }
        );
      }
    });
  }

  deletePublishStatus(id: number) {
    this.publishStatusService.deleteById(id).subscribe(
      response => {
        this.messageHandlerService.showSuccess('下线成功！');
        this.published.emit(true);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  suspend() {
    Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
      if (this.clusterMetas[cluster].checked) {
        this.cronjobClient.suspend(
          this.appId,
          cluster,
          this.cronjob.id,
          this.cronjobTpl.id).subscribe(
          response => {
            this.messageHandlerService.showSuccess('挂起任务成功！');
            this.published.emit(true);
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      }
    });
  }

  deploy() {
    const metaData = JSON.parse(this.cronjob.metaData);
    Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
      metaData['replicas'][cluster] = this.clusterMetas[cluster].value;
    });
    Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
      if (this.clusterMetas[cluster].checked) {
        const kubeCronjob: KubeCronJob = JSON.parse(this.cronjobTpl.template);
        if (metaData['successfulJobsHistoryLimit']) {
          kubeCronjob.spec.successfulJobsHistoryLimit = metaData['successfulJobsHistoryLimit'];
        }
        if (metaData['failedJobsHistoryLimit']) {
          kubeCronjob.spec.failedJobsHistoryLimit = metaData['failedJobsHistoryLimit'];
        }
        // 需要增加时间戳确保内容更新
        // kubeCronjob.spec.jobTemplate.metadata.labels['timestamp'] = new Date().getTime().toString();
        kubeCronjob.spec.suspend = false;
        kubeCronjob.metadata.namespace = this.cacheService.kubeNamespace;
        this.cronjobClient.deploy(
          this.appId,
          cluster,
          this.cronjob.id,
          this.cronjobTpl.id,
          kubeCronjob).subscribe(
          response => {
            this.messageHandlerService.showSuccess('发布成功！');
            this.published.emit(true);
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      }
    });
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing;
  }
}
