import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { KubePod } from '../../../shared/model/v1/kubernetes/kubepod';
import { PageState } from '../../../shared/page/page-state';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { PodClient } from '../../../shared/client/v1/kubernetes/pod';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { AuthService } from '../../../shared/auth/auth.service';
import { KubePodUtil } from '../../../shared/utils';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  KubeResourceJob,
  KubeResourcePod
} from '../../../shared/shared.const';
import { CacheService } from '../../../shared/auth/cache.service';
import { PublicService } from '../../../shared/client/v1/public.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';

@Component({
  selector: 'list-dg-row-pod',
  templateUrl: 'list-pod.component.html',
  styleUrls: ['list-pod.scss']
})

export class ListPodComponent implements OnDestroy, OnInit {
  checkOnGoing = false;
  isSubmitOnGoing = false;
  modalOpened: boolean;
  pods: KubePod[];
  @Input() cluster: string;
  @Input() resourceName: string;

  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  constructor(private router: Router,
              private deletionDialogService: ConfirmationDialogService,
              private route: ActivatedRoute,
              private podClient: PodClient,
              public cacheService: CacheService,
              private publicService: PublicService,
              private clusterService: ClusterService,
              private messageHandlerService: MessageHandlerService,
              private kubernetesClient: KubernetesClient,
              public authService: AuthService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.POD) {
        const pod: KubePod = message.data;
        this.kubernetesClient
          .delete(this.cluster, KubeResourcePod, false, pod.metadata.name, pod.metadata.namespace, this.appId.toString())
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

  // getPodStatus returns the pod state
  getPodStatus(pod: KubePod): string {
    return KubePodUtil.getPodStatus(pod);
  }


  ngOnInit(): void {
    this.pods = null;
    this.modalOpened = true;
    this.refresh();
  }

  closeModal() {
    this.modalOpened = false;
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    if (this.cluster) {
      this.podClient.listPageByResouce(this.pageState, this.cluster, this.cacheService.kubeNamespace, KubeResourceJob,
        this.resourceName, this.appId)
        .subscribe(
          response => {
            const data = response.data;
            this.pods = data.list;
            this.pageState.page.totalPage = data.totalPage;
            this.pageState.page.totalCount = data.totalCount;
          },
          error => {
            this.pods = null;
            this.messageHandlerService.handleError(error);
          }
        );
    }

  }

  deletePod(pod: KubePod) {
    const deletionMessage = new ConfirmationMessage(
      '删除实例确认',
      `是否确认删除实例 ${pod.metadata.name}`,
      pod,
      ConfirmationTargets.POD,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }


  enterContainer(pod: KubePod): void {
    const appId = this.route.parent.snapshot.params['id'];
    const url = `portal/namespace/${this.cacheService.namespaceId}/app/${appId}/${KubeResourceJob}` +
      `/${this.resourceName}/pod/${pod.metadata.name}/terminal/${this.cluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }


  podLog(pod: KubePod): void {
    const appId = this.route.parent.snapshot.params['id'];
    const url = `portal/logging/namespace/${this.cacheService.namespaceId}/app/${appId}/${KubeResourceJob}/${this.resourceName}` +
      `/pod/${pod.metadata.name}/${this.cluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }

}

