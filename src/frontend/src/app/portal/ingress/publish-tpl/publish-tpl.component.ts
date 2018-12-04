import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Cluster } from '../../../shared/model/v1/cluster';
import { CacheService } from '../../../shared/auth/cache.service';
import { ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressClient } from '../../../shared/client/v1/kubernetes/ingress';
import { Ingress } from '../../../shared/model/v1/ingress';
import { KubeIngress } from '../../../shared/model/v1/kubernetes/ingress';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishIngressTplComponent {
  @Output() published = new EventEmitter<boolean>();
  @Input() appId: number;
  modalOpened: boolean = false;
  publishForm: NgForm;
  @ViewChild('publishForm')
  currentForm: NgForm;
  clusters = Array<Cluster>();
  ingressTpl: IngressTpl;
  isSubmitOnGoing: boolean = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private ingressService: IngressService,
              private ingressClient: IngressClient,
              private publishStatusService: PublishStatusService) {
  }

  newPublishTpl(ingress: Ingress, ingressTpl: IngressTpl, actionType: ResourcesActionType) {
    this.ingressTpl = ingressTpl;
    this.clusters = Array<Cluster>();
    this.actionType = actionType;
    this.forceOffline = false;
    if (actionType === ResourcesActionType.PUBLISH) {
      this.title = '发布 Ingress [' + ingress.name + ']';
      if (!ingress.metaData) {
        this.messageHandlerService.warning('请先配置可发布集群');
        return;
      }
      this.modalOpened = true;
      const metaData = JSON.parse(ingress.metaData);
      for (const cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          const c = new Cluster();
          c.name = cluster;
          this.clusters.push(c);
        }
      }

    } else if (actionType === ResourcesActionType.OFFLINE) {
      this.title = '下线 Ingress [' + ingress.name + ']';
      this.modalOpened = true;
      for (const state of ingressTpl.status) {
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
    const state = this.getStatusByCluster(this.ingressTpl.status, cluster.name);
    this.ingressClient.deleteByName(this.appId, cluster.name, this.cacheService.kubeNamespace, this.ingressTpl.name).subscribe(
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
    const kubeIngress: KubeIngress = JSON.parse(this.ingressTpl.template);
    kubeIngress.metadata.namespace = this.cacheService.kubeNamespace;
    this.ingressClient.deploy(
      this.appId,
      cluster.name,
      this.ingressTpl.ingressId,
      this.ingressTpl.id,
      kubeIngress).subscribe(
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

