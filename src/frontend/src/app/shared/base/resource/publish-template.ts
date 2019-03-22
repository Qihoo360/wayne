import { PublishStatusService } from '../../client/v1/publishstatus.service';
import { CacheService } from '../../auth/cache.service';
import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { KubeResourcesName, ResourcesActionType } from '../../shared.const';
import { Cluster } from '../../model/v1/cluster';
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PublishStatus } from '../../model/v1/publish-status';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';

export class PublishTemplate {
  @Output() published = new EventEmitter<boolean>();
  @Input() appId: number;
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm')
  currentForm: NgForm;
  clusters = Array<Cluster>();
  template: any;
  isSubmitOnGoing = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  resourceType: string;
  kubeResource: KubeResourcesName;

  constructor(public messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              public resourceService: any,
              public resourceClient: any,
              public kubernetesClient: KubernetesClient,
              public publishStatusService: PublishStatusService) {
  }

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  newPublishTemplate(resource: any, tmplate: any, actionType: ResourcesActionType) {
    this.template = tmplate;
    this.clusters = Array<Cluster>();
    this.actionType = actionType;
    this.forceOffline = false;
    if (actionType === ResourcesActionType.PUBLISH) {
      this.title = `发布 ${this.resourceType} [` + resource.name + ']';
      if (!resource.metaData) {
        this.messageHandlerService.warning('请先配置可发布集群');
        return;
      }
      this.modalOpened = true;
      const metaData = JSON.parse(resource.metaData);
      for (const cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          const c = new Cluster();
          c.name = cluster;
          this.clusters.push(c);
        }
      }

    } else if (actionType === ResourcesActionType.OFFLINE) {
      this.title = `下线 ${this.resourceType} [` + resource.name + ']';
      this.modalOpened = true;
      for (const state of this.template.status) {
        const c = new Cluster();
        c.name = state.cluster;
        this.clusters.push(c);
      }
    }

  }

  registKubeResource(kubeResource: string) {
    this.kubeResource = kubeResource;
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

    this.clusters.map(cluster => {
      if (cluster.checked) {
        switch (this.actionType) {
          case ResourcesActionType.PUBLISH:
            this.deploy(cluster);
            break;
          case ResourcesActionType.OFFLINE:
            this.offline(cluster);
            break;
        }
      }
    });

    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  getStatusByCluster(status: PublishStatus[], cluster: string): PublishStatus {
    if (status && status.length > 0) {
      for (const state of status) {
        if (state.cluster === cluster) {
          return state;
        }
      }
    }
    return null;
  }

  offline(cluster: Cluster) {
    const state = this.getStatusByCluster(this.template.status, cluster.name);
    this.kubernetesClient.delete(cluster.name, this.kubeResource, false,
      this.template.name, this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
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

  deploy(cluster: Cluster) {
    const kubeResource = JSON.parse(this.template.template);
    kubeResource.metadata.namespace = this.cacheService.kubeNamespace;
    this.resourceClient.deploy(
      this.appId,
      cluster.name,
      this.getResourceId(),
      this.template.id,
      kubeResource).subscribe(
      response => {
        this.messageHandlerService.showSuccess('发布成功！');
        this.published.emit(true);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  public getResourceId() {
    return this.template.resourceId;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing;
  }

}
