import { Component, Inject, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../message-handler/message-handler.service';
import { PublicService } from '../client/v1/public.service';
import { CacheService } from '../auth/cache.service';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets, KubeResourcePod, KubeResourcesName } from '../shared.const';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationMessage } from '../confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { ClusterService } from '../client/v1/cluster.service';
import { Cluster } from '../model/v1/cluster';
import { CopyService } from '../client/v1/copy.service';
import { AuthService } from '../auth/auth.service';
import { PageState } from '../page/page-state';
import { KubePod } from '../model/v1/kubernetes/kubepod';
import { KubePodUtil } from '../utils';
import { KubernetesClient } from '../client/v1/kubernetes/kubernetes';
import { PodClient } from '../client/v1/kubernetes/pod';

@Component({
  selector: 'list-pod',
  templateUrl: 'list-pod.component.html',
  styleUrls: ['list-pod.scss']
})

export class ListPodComponent implements OnDestroy {
  resourceType: KubeResourcesName;
  checkOnGoing = false;
  isSubmitOnGoing = false;
  modalOpened: boolean;
  pods: KubePod[];
  cluster: string;
  resourceName: string;
  logSource: string;
  timer: any;
  whetherHotReflash = true;
  isCopied = false;

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
              @Inject(DOCUMENT) private document: any,
              public cacheService: CacheService,
              private publicService: PublicService,
              private clusterService: ClusterService,
              private messageHandlerService: MessageHandlerService,
              private kubernetesClient: KubernetesClient,
              private copyService: CopyService,
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
    clearInterval(this.timer);
  }

  // getPodStatus returns the pod state
  getPodStatus(pod: KubePod): string {
    return KubePodUtil.getPodStatus(pod);
  }

  openModal(cluster: string, resourceName: string, resourceType: KubeResourcesName) {
    this.cluster = cluster;
    this.resourceType = resourceType;
    this.resourceName = resourceName;
    this.pods = null;
    this.currentPage = 1;
    this.logSource = null;
    this.modalOpened = true;
    this.whetherHotReflash = true;
    this.clusterService.getByName(this.cluster).subscribe(
      response => {
        const data: Cluster = response.data;
        if (data.metaData) {
          const metaData = JSON.parse(data.metaData);
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

  keepUpdate() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (!this.modalOpened) {
        clearInterval(this.timer);
      }
      if (this.whetherHotReflash) {
        this.refresh();
      }
    }, 5000);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    if (this.cluster) {
      this.podClient.listPageByResouce(this.pageState, this.cluster, this.cacheService.kubeNamespace, this.resourceType,
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
    const url = `portal/namespace/${this.cacheService.namespaceId}/app/${appId}/${this.resourceType}` +
      `/${this.resourceName}/pod/${pod.metadata.name}/terminal/${this.cluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }

  switchCopyButton() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
  }

  copyLogCommand(pod: KubePod): void {
    if (this.logSource === undefined) {
      this.messageHandlerService.showInfo('缺少机房信息，请联系管理员');
    }
    const kubeToolCmd = `kubetool log --source ${this.logSource === undefined ? '' : this.logSource} ` +
      ` --${this.resourceType === 'deployments' ? 'deployment' : this.resourceType} ${this.resourceName}` +
      ` --pod=${pod.metadata.name} --layout=log`;
    this.copyService.copy(kubeToolCmd);
    this.switchCopyButton();
  }


  podLog(pod: KubePod): void {
    const appId = this.route.parent.snapshot.params['id'];
    const url = `portal/logging/namespace/${this.cacheService.namespaceId}/app/${appId}/${this.resourceType}/${this.resourceName}` +
      `/pod/${pod.metadata.name}/${this.cluster}/${this.cacheService.kubeNamespace}`;
    window.open(url, '_blank');
  }
}


