import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { Inventory, StateComparator, TimeComparator } from './inventory';
import { SortOrder } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Pod } from '../../../shared/model/v1/kubernetes/pod';
import { PodClient } from '../../../shared/client/v1/kubernetes/pod';
import { PublicService } from '../../../shared/client/v1/public.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { Cluster } from '../../../shared/model/v1/cluster';

@Component({
  selector: 'list-pod',
  providers: [Inventory],
  templateUrl: 'list-pod.component.html',
  styleUrls: ['list-pod.scss']
})

export class ListPodComponent implements OnInit, OnDestroy {
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  modalOpened: boolean;
  pods: Pod[];
  sortOrder: SortOrder = SortOrder.Unsorted;
  sorted: boolean = false;
  timeComparator = new TimeComparator();
  stateComparator = new StateComparator();
  currentCluster: string;
  daemonSet: string;
  logSource: string;
  timer: any;
  whetherHotReflash: boolean = true;

  subscription: Subscription;

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id']);
  }

  constructor(private inventory: Inventory,
              private router: Router,
              private deletionDialogService: ConfirmationDialogService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: any,
              public cacheService: CacheService,
              private publicService: PublicService,
              private clusterService: ClusterService,
              private messageHandlerService: MessageHandlerService,
              private podClient: PodClient) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.POD) {
        let pod: Pod = message.data;
        this.podClient
          .deleteByName(this.appId, this.currentCluster, pod.namespace, pod.name)
          .subscribe(
            response => {
              this.refresh();
              this.messageHandlerService.showSuccess('实例删除成功！');
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.timer);
  }

  openModal(cluster: string, daemonSet: string) {
    this.currentCluster = cluster;
    this.daemonSet = daemonSet;
    this.pods = null;
    this.modalOpened = true;
    this.whetherHotReflash = true;
    this.clusterService.getByName(this.currentCluster).subscribe(
      response => {
        let cluster: Cluster = response.data;
        if (cluster.metaData) {
          let metaData = JSON.parse(cluster.metaData);
          if (metaData.logSource) {
            this.logSource = metaData.logSource;
          }
        }
        this.keepUpdate();
        this.refresh();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  closeModal() {
    this.modalOpened = false;
    clearInterval(this.timer);
  }

  ngOnInit(): void {
  }

  keepUpdate() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (!this.modalOpened) {
        clearInterval(this.timer);
        return;
      }
      if (this.whetherHotReflash) this.refresh();
    }, 5000);
  }

  refresh() {
    this.podClient.listByResouce(this.appId, this.currentCluster, this.cacheService.kubeNamespace, 'daemonSet', this.daemonSet).subscribe(
      response => {
        let pods = response.data;
        this.inventory.size = pods.length;
        this.inventory.reset(pods);
        this.pods = this.inventory.all;
      },
      error => {
        this.pods = null;
        this.messageHandlerService.handleError(error);
      }
    );
  }

  deletePod(pod: Pod) {
    let deletionMessage = new ConfirmationMessage(
      '删除实例确认',
      `是否确认删除实例 ${pod.name}`,
      pod,
      ConfirmationTargets.POD,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }


  enterContainer(pod: Pod): void {
    let appId = this.route.parent.snapshot.params['id'];
    let url = `portal/namespace/${this.cacheService.namespaceId}/app/${appId}/daemonSet/${this.daemonSet}/pod/${pod.name}/terminal/${this.currentCluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }


  podLog(pod: Pod): void {

    let appId = this.route.parent.snapshot.params['id'];
    let url = `portal/logging/namespace/${this.cacheService.namespaceId}/app/${appId}/daemonSet/${this.daemonSet}/pod/${pod.name}/${this.currentCluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }
}


