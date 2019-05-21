import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Deployment } from '../../../shared/model/v1/deployment';
import { ClusterMeta } from '../../../shared/model/v1/cluster';
import { DeploymentStatus, DeploymentTpl } from '../../../shared/model/v1/deploymenttpl';
import { KubeDeployment } from '../../../shared/model/v1/kubernetes/deployment';
import { CacheService } from '../../../shared/auth/cache.service';
import { defaultResources, ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { DeploymentClient } from '../../../shared/client/v1/kubernetes/deployment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishDeploymentTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm')
  currentForm: NgForm;

  deployment: Deployment;
  deploymentTpl: DeploymentTpl;
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
              private deploymentClient: DeploymentClient) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  replicaValidation(cluster: string): boolean {
    const clusterMeta = this.clusterMetas[cluster];
    if (this.deployment && this.deployment.metaData && clusterMeta) {
      if (!clusterMeta.checked) {
        return true;
      }
      return parseInt(clusterMeta.value, 10) <= this.replicaLimit;
    }
    return false;
  }

  get replicaLimit(): number {
    let replicaLimit = defaultResources.replicaLimit;
    if (this.deployment && this.deployment.metaData) {
      const metaData = JSON.parse(this.deployment.metaData);
      if (metaData.resources &&
        metaData.resources.replicaLimit) {
        replicaLimit = parseInt(metaData.resources.replicaLimit, 10);
      }
    }
    return replicaLimit;
  }

  newPublishTpl(deployment: Deployment, deploymentTpl: DeploymentTpl, actionType: ResourcesActionType) {
    const replicas = this.getReplicas(deployment);
    this.actionType = actionType;
    this.forceOffline = false;
    if (replicas != null) {
      this.modalOpened = true;
      this.deployment = deployment;
      this.setTitle(actionType);
      this.deploymentTpl = deploymentTpl;
      this.clusters = Array<string>();
      this.clusterMetas = {};
      if (actionType === ResourcesActionType.OFFLINE || actionType === ResourcesActionType.RESTART) {
        deploymentTpl.status.map(state => {
          const clusterMeta = new ClusterMeta(false);
          clusterMeta.value = replicas[state.cluster];
          this.clusterMetas[state.cluster] = clusterMeta;
          this.clusters.push(state.cluster);
        });
      } else {
        Object.getOwnPropertyNames(replicas).map(key => {
          if ((actionType === ResourcesActionType.PUBLISH || this.getStatusByCluster(deploymentTpl.status, key) != null)
            && this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[key]) {
            // 后端配置的集群才会显示出来
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
        this.title = '发布部署[' + this.deployment.name + ']';
        break;
      case ResourcesActionType.RESTART:
        this.title = '重启部署[' + this.deployment.name + ']';
        break;
      case ResourcesActionType.OFFLINE:
        this.title = '下线部署[' + this.deployment.name + ']';
        break;
    }
  }

  getStatusByCluster(status: DeploymentStatus[], cluster: string): DeploymentStatus {
    if (status && status.length > 0) {
      for (const state of status) {
        if (state.cluster === cluster) {
          return state;
        }
      }
    }
    return null;
  }

  getReplicas(deployment: Deployment): {} {
    if (!deployment.metaData) {
      this.messageHandlerService.showWarning('部署实例数未配置，请先到编辑部署配置实例数！');
      return null;
    }
    const replicas = JSON.parse(deployment.metaData)['replicas'];
    if (!replicas) {
      this.messageHandlerService.showWarning('部署实例数未配置，请先到编辑部署配置实例数！');
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
        const state = this.getStatusByCluster(this.deploymentTpl.status, cluster);
        this.deploymentClient.deleteByName(this.appId, cluster, this.cacheService.kubeNamespace, this.deployment.name).subscribe(
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
        const kubeDeployment: KubeDeployment = JSON.parse(this.deploymentTpl.template);
        if (this.actionType === ResourcesActionType.RESTART) {
          kubeDeployment.spec.template.metadata.labels['timestamp'] = new Date().getTime().toString();
        }
        kubeDeployment.metadata.namespace = this.cacheService.kubeNamespace;
        kubeDeployment.spec.replicas = this.clusterMetas[cluster].value;
        observables.push(this.deploymentClient.deploy(
          this.appId,
          cluster,
          this.deployment.id,
          this.deploymentTpl.id,
          kubeDeployment));
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

