import { ViewChild } from '@angular/core';
import { CreateEditResource } from './create-edit-resource';
import { ResourceLimitComponent } from '../../component/resource-limit/resource-limit.component';
import { ClusterMeta, Cluster } from '../../model/v1/cluster';
import { defaultResources } from '../../shared.const';
import { AuthService } from 'app/shared/auth/auth.service';
import { MessageHandlerService } from 'app/shared/message-handler/message-handler.service';

export class CreateEditLimitResource extends CreateEditResource {
  @ViewChild(ResourceLimitComponent, { static: false })
  resourceLimitComponent: ResourceLimitComponent;
  defaultClusterNum = 0;
  constructor(
    public resourceService: any,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService
  ) {
    super(resourceService, authService, messageHandlerService);
  }

  setMetaData() {
    this.resource.metaData = this.resource.metaData ? this.resource.metaData : '{}';
    const metaData = JSON.parse(this.resource.metaData);
    if (this.clusters && this.clusters.length > 0) {
      const replicas = metaData['replicas'];
      for (const clu of this.clusters) {
        const culsterMeta = new ClusterMeta(false);
        if (replicas && replicas[clu.name]) {
          culsterMeta.checked = true;
          culsterMeta.value = this.defaultClusterNum ? this.defaultClusterNum : replicas[clu.name];
        }
        this.clusterMetas[clu.name] = culsterMeta;
      }
    }
    this.resourceLimitComponent.setValue(metaData['resources']);
  }

  initMetaData() {
    this.resource.metaData = '{}';
    this.resourceLimitComponent.setValue();
  }

  get replicaLimit(): number {
    let replicaLimit = defaultResources.replicaLimit;
    if (this.resource && this.resource.metaData) {
      const metaData = JSON.parse(this.resource.metaData);
      if (metaData.resources &&
        metaData.resources.replicaLimit) {
        replicaLimit = parseInt(metaData.resources.replicaLimit, 10);
      }
    }
    return replicaLimit;
  }

  replicaValidation(cluster: string): boolean {
    const clusterMeta = this.clusterMetas[cluster];
    if (this.resource && this.resource.metaData && clusterMeta) {
      if (!clusterMeta.checked) {
        return true;
      }
      return parseInt(clusterMeta.value, 10) <= this.replicaLimit;
    }
    return false;
  }

  formatMetaData() {
    if (!this.resource.metaData) {
      this.resource.metaData = '{}';
    }
    const metaData = JSON.parse(this.resource.metaData);
    const replicas = {};
    for (const clu of this.clusters) {
      const clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        replicas[clu.name] = clusterMeta.value;
      }
    }
    metaData.replicas = replicas;
    metaData.resources = this.resourceLimitComponent.getValue();
    this.resource.metaData = JSON.stringify(metaData);
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing &&
      this.isClusterValid() &&
      this.isClusterReplicaValid();
  }

  isClusterReplicaValid(): boolean {
    if (this.clusters) {
      for (const clu of this.clusters) {
        if (!this.replicaValidation(clu.name)) {
          return false;
        }
      }
    }
    return true;
  }
}
