import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { ResourcesActionType } from '../../../shared/shared.const';
import { PublishStatusService } from '../../../shared/client/v1/publishstatus.service';
import { DaemonSetClient } from '../../../shared/client/v1/kubernetes/daemonset';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { TemplateStatus } from '../../../shared/model/v1/status';
import { Cluster } from '../../../shared/model/v1/cluster';
import { DaemonSetTemplate } from '../../../shared/model/v1/daemonsettpl';
import { KubeDaemonSet } from '../../../shared/model/v1/kubernetes/daemonset';

@Component({
  selector: 'daemonset-publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishDaemonSetTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened = false;
  publishForm: NgForm;
  @ViewChild('publishForm', { static: true })
  currentForm: NgForm;

  daemonSet: DaemonSet;
  daemonSetTpl: DaemonSetTemplate;
  clusters = Array<Cluster>();
  isSubmitOnGoing = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private publishStatusService: PublishStatusService,
              private daemonSetClient: DaemonSetClient) {
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  newPublishTpl(daemonSet: DaemonSet, daemonSetTpl: DaemonSetTemplate, actionType: ResourcesActionType) {
    this.actionType = actionType;
    this.forceOffline = false;
    this.modalOpened = true;
    this.clusters = Array<Cluster>();
    this.daemonSetTpl = daemonSetTpl;
    this.daemonSet = daemonSet;
    if (actionType === ResourcesActionType.PUBLISH) {
      this.title = '发布守护进程集[' + this.daemonSet.name + ']';
      if (!daemonSet.metaData) {
        this.messageHandlerService.warning('请先配置可发布集群');
        return;
      }
      const metaData = JSON.parse(daemonSet.metaData);
      for (const cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          this.clusters.push(new Cluster(cluster, false));
        }
      }
    } else if (actionType === ResourcesActionType.OFFLINE) {
      this.title = '下线守护进程集[' + this.daemonSet.name + ']';
      for (const state of daemonSetTpl.status) {
        this.clusters.push(new Cluster(state.cluster, false));
      }
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
      case ResourcesActionType.OFFLINE:
        this.offline();
        break;
    }

    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  offline() {
    this.clusters.map(cluster => {
      if (cluster.checked) {
        const state = this.getStatusByCluster(this.daemonSetTpl.status, cluster.name);
        this.daemonSetClient.deleteByName(this.appId, cluster.name, this.cacheService.kubeNamespace, this.daemonSet.name).subscribe(
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
    this.clusters.map(cluster => {
      if (cluster.checked) {
        const kubeDaemonSet: KubeDaemonSet = JSON.parse(this.daemonSetTpl.template);
        kubeDaemonSet.metadata.namespace = this.cacheService.kubeNamespace;
        observables.push(this.daemonSetClient.deploy(
          this.appId,
          cluster.name,
          this.daemonSet.id,
          this.daemonSetTpl.id,
          kubeDaemonSet));
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

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing;
  }

}

