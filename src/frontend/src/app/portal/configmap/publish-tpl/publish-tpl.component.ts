import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfigMapTpl } from '../../../shared/model/v1/configmaptpl';
import { Cluster } from '../../../shared/model/v1/cluster';
import { KubeConfigMap } from '../../../shared/model/v1/kubernetes/configmap';
import { CacheService } from '../../../shared/auth/cache.service';
import { KubeResourceConfigMap, ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { ConfigMapClient } from '../../../shared/client/v1/kubernetes/configmap';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { ActivatedRoute } from '@angular/router';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishConfigMapTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm', { static: true })
  currentForm: NgForm;

  configMapTpl: ConfigMapTpl;
  clusters = Array<Cluster>();
  isSubmitOnGoing = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(public cacheService: CacheService,
              private configMapClient: ConfigMapClient,
              private kubernetesClient: KubernetesClient,
              private route: ActivatedRoute,
              private publishStatusService: PublishStatusService,
              private messageHandlerService: MessageHandlerService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  newPublishTpl(configMapTpl: ConfigMapTpl, actionType: ResourcesActionType) {
    this.actionType = actionType;
    this.clusters = Array<Cluster>();
    this.configMapTpl = configMapTpl;
    this.forceOffline = false;
    if (actionType === ResourcesActionType.PUBLISH) {
      this.title = '发布配置集[' + configMapTpl.name + ']';
      if (!configMapTpl.metaData) {
        this.messageHandlerService.warning('请先选择可发布集群');
        return;
      }
      this.modalOpened = true;
      const metaData = JSON.parse(configMapTpl.metaData);
      for (const cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          const c = new Cluster();
          c.name = cluster;
          this.clusters.push(c);
        }
      }
    } else if (actionType === ResourcesActionType.OFFLINE) {
      this.modalOpened = true;
      this.title = '下线配置集[' + configMapTpl.name + ']';
      for (const state of configMapTpl.status) {
        const c = new Cluster();
        c.name = state.cluster;
        this.clusters.push(c);
      }
    }
  }


  onCancel() {
    this.currentForm.reset();
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


  offline(cluster: Cluster) {
    const state = this.getStatusByCluster(this.configMapTpl.status, cluster.name);
    this.kubernetesClient.delete(cluster.name, KubeResourceConfigMap, false,
      this.configMapTpl.name, this.cacheService.kubeNamespace, this.appId.toString()).subscribe(
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
    const kubeConfigMap: KubeConfigMap = JSON.parse(this.configMapTpl.template);
    kubeConfigMap.metadata.namespace = this.cacheService.kubeNamespace;
    this.configMapClient.deploy(
      this.appId,
      cluster.name,
      this.configMapTpl.configMapId,
      this.configMapTpl.id,
      kubeConfigMap
    ).subscribe(
      response => {
        this.messageHandlerService.showSuccess('发布成功！');
        this.published.emit(true);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing;
  }

}

