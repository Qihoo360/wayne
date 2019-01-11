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
import { ActivatedRoute } from '@angular/router';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { KubeJob } from '../../../shared/model/v1/kubernetes/job';

@Component({
  selector: 'list-pod',
  providers: [Inventory],
  templateUrl: 'list-pod.component.html',
  styleUrls: ['list-pod.scss']
})

export class ListPodComponent implements OnInit, OnDestroy {
  checkOnGoing = false;
  isSubmitOnGoing = false;
  modalOpened: boolean;
  pods: Pod[];
  sortOrder: SortOrder = SortOrder.Unsorted;
  sorted = false;
  timeComparator = new TimeComparator();
  stateComparator = new StateComparator();
  currentCluster: string;
  job: KubeJob;

  subscription: Subscription;

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id']);
  }


  constructor(private inventory: Inventory,
              private deletionDialogService: ConfirmationDialogService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: any,
              public cacheService: CacheService,
              private publicService: PublicService,
              private messageHandlerService: MessageHandlerService,
              private podClient: PodClient) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.POD) {
        const pod: Pod = message.data;
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
  }

  openModal(cluster: string, job: KubeJob) {
    this.currentCluster = cluster;
    this.job = job;
    this.modalOpened = true;
    this.refresh();
  }

  ngOnInit(): void {
  }

  refresh() {
    this.pods = null;
    this.podClient.listByResouce(this.appId, this.currentCluster, this.cacheService.kubeNamespace, 'job', this.job.metadata.name).subscribe(
      response => {
        const pods = response.data;
        this.inventory.size = pods.length;
        this.inventory.reset(pods);
        this.pods = this.inventory.all;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  deletePod(pod: Pod) {
    const deletionMessage = new ConfirmationMessage(
      '删除实例确认',
      `是否确认删除实例 ${pod.name}`,
      pod,
      ConfirmationTargets.POD,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  enterContainer(pod: Pod): void {
    const appId = this.route.parent.snapshot.params['id'];
    const url = `portal/namespace/${this.cacheService.namespaceId}/app/${appId}/job/${this.job.metadata.name}/pod/${pod.name}/terminal/${this.currentCluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }

  podLog(pod: Pod): void {
    const appId = this.route.parent.snapshot.params['id'];
    const url = `portal/logging/namespace/${this.cacheService.namespaceId}/app/${appId}/job/${this.job.metadata.name}/pod/${pod.name}/${this.currentCluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }
}


