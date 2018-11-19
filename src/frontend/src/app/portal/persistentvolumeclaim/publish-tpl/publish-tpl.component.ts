import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {Cluster} from '../../../shared/model/v1/cluster';
import {CacheService} from '../../../shared/auth/cache.service';
import {ResourcesActionType} from '../../../shared/shared.const';
import {PersistentVolumeClaimTpl} from '../../../shared/model/v1/persistentvolumeclaimtpl';
import {PublishStatus} from '../../../shared/model/v1/publish-status';
import {PersistentVolumeClaimClient} from '../../../shared/client/v1/kubernetes/persistentvolumeclaims';
import {PublishStatusService} from '../../../shared/client/v1/publishstatus.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'publish-tpl',
  templateUrl: 'publish-tpl.component.html',
  styleUrls: ['publish-tpl.scss']
})
export class PublishPersistentVolumeClaimTplComponent {
  @Output() published = new EventEmitter<boolean>();
  modalOpened: boolean = false;
  publishForm: NgForm;
  @ViewChild('publishForm')
  currentForm: NgForm;

  pvcTpl: PersistentVolumeClaimTpl;
  clusters = Array<Cluster>();
  isSubmitOnGoing: boolean = false;
  title: string;
  forceOffline: boolean;
  actionType: ResourcesActionType;

  constructor(public cacheService: CacheService,
              private route: ActivatedRoute,
              private publishStatusService: PublishStatusService,
              private persistentVolumeClaimClient: PersistentVolumeClaimClient,
              private messageHandlerService: MessageHandlerService) {
  }

  get appId(): number {
    return parseInt(this.route.parent.parent.snapshot.params['id']);
  }

  newPublishTpl(pvcTpl: PersistentVolumeClaimTpl, actionType: ResourcesActionType) {
    this.actionType = actionType;
    this.clusters = Array<Cluster>();
    this.pvcTpl = pvcTpl;
    this.forceOffline = false;
    if (actionType == ResourcesActionType.PUBLISH) {
      this.title = '发布PVC[' + pvcTpl.name + ']';
      if (!pvcTpl.metaData) {
        this.messageHandlerService.warning('请先选择可发布集群');
        return
      }
      this.modalOpened = true;
      let metaData = JSON.parse(pvcTpl.metaData);
      for (let cluster of metaData.clusters) {
        if (this.cacheService.namespace.metaDataObj && this.cacheService.namespace.metaDataObj.clusterMeta[cluster]) {
          let c = new Cluster();
          c.name = cluster;
          this.clusters.push(c)
        }
      }
    } else if (actionType == ResourcesActionType.OFFLINE) {
      this.modalOpened = true;
      this.title = '下线PVC[' + pvcTpl.name + ']';
      for (let state of pvcTpl.status) {
        let c = new Cluster();
        c.name = state.cluster;
        this.clusters.push(c)
      }
    }

  }

  getStatusByCluster(status: PublishStatus[], cluster: string): PublishStatus {
    if (status && status.length > 0) {
      for (let state of status) {
        if (state.cluster == cluster) {
          return state
        }
      }
    }
    return null
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
    let state = this.getStatusByCluster(this.pvcTpl.status, cluster.name);
    this.persistentVolumeClaimClient.deleteByName(this.appId, cluster.name, this.cacheService.kubeNamespace, this.pvcTpl.name).subscribe(
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
    let kubePvc = JSON.parse(this.pvcTpl.template);
    kubePvc.metadata.namespace = this.cacheService.kubeNamespace;
    this.persistentVolumeClaimClient.deploy(
      this.appId,
      cluster.name,
      this.pvcTpl.persistentVolumeClaimId,
      this.pvcTpl.id,
      kubePvc
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

