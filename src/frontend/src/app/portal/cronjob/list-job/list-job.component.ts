import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Job } from '../../../shared/model/v1/job';
import { JobClient } from '../../../shared/client/v1/kubernetes/job';
import { ListPodComponent } from '../../../shared/list-pod/list-pod.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { CacheService } from '../../../shared/auth/cache.service';
import { ListEventComponent } from '../list-event/list-event.component';
import { Event } from '../../../shared/model/v1/deploymenttpl';
import { Page } from '../../../shared/page/page-state';
import { StorageService } from '../../../shared/client/v1/storage.service';

@Component({
  selector: 'list-job',
  templateUrl: 'list-job.component.html',
  styleUrls: ['list-job.scss']
})

export class ListJobComponent implements OnInit, OnDestroy {
  @Input() jobs: Job[];
  @Input() page: Page;
  @Input() currentCronjobName: string;
  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  _pageSize = 10;
  @ViewChild(ListPodComponent)
  listPodComponent: ListPodComponent;
  @ViewChild(ListEventComponent)
  listEventComponent: ListEventComponent;

  private timer: any = null;
  subscription: Subscription;
  componentName = '任务';
  pageSizes: number[] = new Array(10, 20, 50);

  constructor(
    private deletionDialogService: ConfirmationDialogService,
    private messageHandlerService: MessageHandlerService,
    public cacheService: CacheService,
    private route: ActivatedRoute,
    private jobClient: JobClient,
    private storage: StorageService) {
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

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(page: number) {
    if (page && this.pageSizes.indexOf(page) > -1) {
      this.storage.save('pagesize', page);
    }
    if (page !== this._pageSize) {
      this._pageSize = Number(page);
    }
  }

  ngOnInit(): void {
    this.periodSyncStatus();
    this._pageSize = parseInt(this.storage.get('pagesize') || '10', 10);
  }

  listPod(job: Job) {
    // 只允许查看非完成的pod列表?
    this.listPodComponent.openModal(job.cluster, job.kubeJob.metadata.name);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.paginate.emit(state);
  }

  periodSyncStatus() {
    this.timer = setInterval(() => {
      this.syncStatus();
    }, 5000);
  }

  syncStatus() {
    if (this.jobs && this.jobs.length > 0) {
      for (let i = 0; i < this.jobs.length; i++) {
        const oneJob = this.jobs[i];
        const job = oneJob.kubeJob;
        if (!job.status['conditions'] || !job.status['conditions'][0]['type']) {
          this.jobClient.PodsEvent(
            this.appId,
            oneJob.cluster,
            this.cacheService.kubeNamespace,
            job.metadata.name,
            this.currentCronjobName
          ).subscribe(
            response => {
              // 防止切换tab tpls数据发生变化导致报错
              const eventsInfo = response.data;
              if (this.jobs &&
                this.jobs[i] &&
                this.jobs[i].kubeJob.status['detail']) {
                if (eventsInfo['warnings'] && eventsInfo['warnings'].length > 0) {
                  this.jobs[i].kubeJob.status['detail'] = 'warnings';
                  this.jobs[i].kubeJob.status['warnings'] = eventsInfo['warnings'];
                } else {
                  if (eventsInfo['current'] === 0) {
                    this.jobs[i].kubeJob.status['detail'] = 'failed';
                  } else {
                    this.jobs[i].kubeJob.status['detail'] = 'active';
                  }
                }
              }
            },
            error => {
              console.log(error);
            }
          );
          // 防止同时发起jobs.length个请求，找到一个符合条件则break
          break;
        }
      }
    }
  }

  listEvent(warnings: Event[]) {
    if (warnings) {
      this.listEventComponent.openModal(warnings);
    }
  }
}
