import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';

import { KubeStatefulSet } from '../../../shared/model/v1/kubernetes/statefulset';
import { CacheService } from '../../../shared/auth/cache.service';
import { defaultResources, KubeResourceStatefulSet, ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { StatefulsetClient } from '../../../shared/client/v1/kubernetes/statefulset';
import { ActivatedRoute } from '@angular/router';
import { Statefulset } from '../../../shared/model/v1/statefulset';
import { StatefulsetTemplate } from '../../../shared/model/v1/statefulsettpl';
import { TemplateStatus } from '../../../shared/model/v1/status';
import { ClusterMeta } from '../../../shared/model/v1/cluster';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'statefulset-publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishStatefulsetTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm', { static: true })
  currentForm: NgForm;

  statefulset: Statefulset;
  statefulsetTpl: StatefulsetTemplate;
  clusterMetas = {};
  clusters = Array<string>();
  isSubmitOnGoing = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private publishStatusService: PublishStatusService,
              private kubernetesClient: KubernetesClient,
              private statefulsetClient: StatefulsetClient) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  replicaValidation(cluster: string): boolean {
    const clusterMeta = this.clusterMetas[cluster];
    if (this.statefulset && this.statefulset.metaData && clusterMeta) {
      if (!clusterMeta.checked) {
        return true;
      }
      return parseInt(clusterMeta.value, 10) <= this.replicaLimit;
    }
    return false;
  }

  get replicaLimit(): number {
    let replicaLimit = defaultResources.replicaLimit;
    if (this.statefulset && this.statefulset.metaData) {
      const metaData = JSON.parse(this.statefulset.metaData);
      if (metaData.resources &&
        metaData.resources.replicaLimit) {
        replicaLimit = parseInt(metaData.resources.replicaLimit, 10);
      }
    }
    return replicaLimit;
  }

  newPublishTpl(statefulset: Statefulset, statefulsetTpl: StatefulsetTemplate, actionType: ResourcesActionType) {
    const replicas = this.getReplicas(statefulset);
    this.actionType = actionType;
    this.forceOffline = false;
    if (replicas != null) {
      this.modalOpened = true;
      this.statefulset = statefulset;
      this.setTitle(actionType);
      this.statefulsetTpl = statefulsetTpl;
      this.clusters = Array<string>();
      this.clusterMetas = {};
      if (actionType === ResourcesActionType.OFFLINE) {
        statefulsetTpl.status.map(state => {
          this.clusters.push(state.cluster);
          this.clusterMetas[state.cluster] = new ClusterMeta(false);
        });
      } else {
        Object.getOwnPropertyNames(replicas).map(key => {
          if ((actionType === ResourcesActionType.PUBLISH || this.getStatusByCluster(statefulsetTpl.status, key) != null)
            && this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[key]) {
            const clusterMeta = new ClusterMeta(false);
            clusterMeta.value = replicas[key];
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
        this.title = '发布状态副本集[' + this.statefulset.name + ']';
        break;
      case ResourcesActionType.RESTART:
        this.title = '重启状态副本集[' + this.statefulset.name + ']';
        break;
      case ResourcesActionType.OFFLINE:
        this.title = '下线状态副本集[' + this.statefulset.name + ']';
        break;
    }
  }

  getStatusByCluster(status: TemplateStatus[], cluster: string): TemplateStatus {
    if (status && status.length > 0) {
      for (const state of status) {
        if (state.cluster === cluster) {
          return state;
        }
      }
    }
    return null;
  }

  getReplicas(statefulset: Statefulset): {} {
    if (!statefulset.metaData) {
      this.messageHandlerService.showWarning('状态副本集实例数未配置，请先到编辑状态副本集配置实例数！');
      return null;
    }
    const replicas = JSON.parse(statefulset.metaData)['replicas'];
    if (!replicas) {
      this.messageHandlerService.showWarning('状态副本集实例数未配置，请先到编辑状态副本集配置实例数！');
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
    }

    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  offline() {
    Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
      if (this.clusterMetas[cluster].checked) {
        const state = this.getStatusByCluster(this.statefulsetTpl.status, cluster);
        this.kubernetesClient.delete(cluster, KubeResourceStatefulSet, false, this.statefulset.name,
          this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
          response => {
            this.deletePublishStatus(state.id);
          },
          error => {
            if (this.forceOffline) {
              this.deletePublishStatus(state.id);
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

  deploy() {
    const observables = Array();
    Object.getOwnPropertyNames(this.clusterMetas).forEach(cluster => {
      if (this.clusterMetas[cluster].checked) {
        const kubeStatefulSet: KubeStatefulSet = JSON.parse(this.statefulsetTpl.template);
        if (this.actionType === ResourcesActionType.RESTART) {
          kubeStatefulSet.spec.template.metadata.labels['timestamp'] = new Date().getTime().toString();
        }
        kubeStatefulSet.metadata.namespace = this.cacheService.kubeNamespace;
        kubeStatefulSet.spec.replicas = this.clusterMetas[cluster].value;
        observables.push(this.statefulsetClient.deploy(
          this.appId,
          cluster,
          this.statefulset.id,
          this.statefulsetTpl.id,
          kubeStatefulSet));
      }
    });
    forkJoin(observables).subscribe(
      response => {
        this.published.emit(true);
        this.messageHandlerService.showSuccess('发布成功！');
      },
      error => {
        this.published.emit(true);
        this.messageHandlerService.handleError(error);
      }
    );

  }

  isClusterReplicaValid(): boolean {
    if (this.clusters) {
      for (const clu of this.clusters) {
        if (!this.replicaValidation(clu)) {
          return false;
        }
      }
    }
    return true;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isClusterReplicaValid();
  }

}

