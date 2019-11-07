import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { Cluster } from '../../../shared/model/v1/cluster';
import { KubeSecret } from '../../../shared/model/v1/kubernetes/secret';
import { CacheService } from '../../../shared/auth/cache.service';
import { KubeResourceSecret, ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { SecretClient } from '../../../shared/client/v1/kubernetes/secret';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { ActivatedRoute } from '@angular/router';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishSecretTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm', { static: true })
  currentForm: NgForm;

  secretTpl: SecretTpl;
  clusters = Array<Cluster>();
  isSubmitOnGoing = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private secretClient: SecretClient,
              private kubernetesClient: KubernetesClient,
              private publishStatusService: PublishStatusService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  newPublishTpl(secretTpl: SecretTpl, actionType: ResourcesActionType) {
    this.actionType = actionType;
    this.clusters = Array<Cluster>();
    this.secretTpl = secretTpl;
    this.forceOffline = false;
    if (actionType === ResourcesActionType.PUBLISH) {
      this.title = '发布加密字典[' + secretTpl.name + ']';
      if (!secretTpl.metaData) {
        this.messageHandlerService.warning('请先选择可发布集群');
        return;
      }
      this.modalOpened = true;
      const metaData = JSON.parse(secretTpl.metaData);
      for (const cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          const c = new Cluster();
          c.name = cluster;
          this.clusters.push(c);
        }
      }
    } else if (actionType === ResourcesActionType.OFFLINE) {
      this.modalOpened = true;
      this.title = '下线加密字典[' + secretTpl.name + ']';
      for (const state of secretTpl.status) {
        const c = new Cluster();
        c.name = state.cluster;
        this.clusters.push(c);
      }
    }
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

  offline(cluster: Cluster) {
    const state = this.getStatusByCluster(this.secretTpl.status, cluster.name);
    this.kubernetesClient.delete(cluster.name, KubeResourceSecret, false, this.secretTpl.name,
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
    const kubeSecret: KubeSecret = JSON.parse(this.secretTpl.template);
    kubeSecret.metadata.namespace = this.cacheService.kubeNamespace;
    this.secretClient.deploy(
      this.appId,
      cluster.name,
      this.secretTpl.secretId,
      this.secretTpl.id,
      kubeSecret
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

