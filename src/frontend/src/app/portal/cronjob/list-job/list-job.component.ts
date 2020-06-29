import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { JobClient } from '../../../shared/client/v1/kubernetes/job';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { CacheService } from '../../../shared/auth/cache.service';
import { PageState } from '../../../shared/page/page-state';
import { KubeJob } from '../../../shared/model/v1/kubernetes/job';
import { ListPodComponent } from '../list-pod/list-pod.component';
import { ListEventDatagridComponent } from '../../../shared/list-event-datagrid/list-event.component';
import { KubeCronJob } from '../../../shared/model/v1/kubernetes/cronjob';
import { AuthService } from '../../../shared/auth/auth.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';

@Component({
  selector: 'list-job',
  templateUrl: 'list-job.component.html',
  styleUrls: ['list-job.scss']
})

export class ListJobComponent implements OnDestroy {
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @ViewChild(ListPodComponent, {static: false})
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventDatagridComponent, {static: false})
  listEventDatagridComponent: ListEventDatagridComponent;
  jobs: KubeJob[];
  private timer: any = null;
  subscription: Subscription;
  cluster: string;
  kubeObj: KubeCronJob;

  modalOpened: boolean;
  whetherHotReflash = false;

  constructor(
    private deletionDialogService: ConfirmationDialogService,
    private messageHandlerService: MessageHandlerService,
    public authService: AuthService,
    public cacheService: CacheService,
    private route: ActivatedRoute,
    private jobClient: JobClient) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.JOB) {
        const name = message.data;
        this.jobClient.deleteJobByName(this.cluster, this.cacheService.kubeNamespace, name, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('任务' + name + '删除成功！');
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  openModal(cluster: string, kubeObj: any) {
    this.cluster = cluster;
    this.kubeObj = kubeObj;
    this.jobs = null;
    this.modalOpened = true;
    this.whetherHotReflash = false;
    this.keepUpdate();
    this.refresh();
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

  isReady(obj: any): boolean {
    const readyNumber = obj.status.succeeded ? obj.status.succeeded : 0;
    const desiredNumber = obj.spec.completions;
    if (!desiredNumber && readyNumber > 0) {
      return true;
    }
    return readyNumber === desiredNumber;
  }

  deleteJob(obj: KubeJob): void {
    const deletionMessage = new ConfirmationMessage(
      '删除确认',
      `你确认删除任务${obj.metadata.name}？`,
      obj.metadata.name,
      ConfirmationTargets.JOB,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    if (this.cluster) {
      this.jobClient.listJobByCronJob(this.pageState, this.cluster, this.cacheService.kubeNamespace,
        this.kubeObj.metadata.name, this.appId)
        .subscribe(
          response => {
            const data = response.data;
            this.jobs = data.list;
            this.pageState.page.totalPage = data.totalPage;
            this.pageState.page.totalCount = data.totalCount;
          },
          error => {
            this.jobs = null;
            this.messageHandlerService.handleError(error);
          }
        );
    }

  }
}
