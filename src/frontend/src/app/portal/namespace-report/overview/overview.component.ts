import { Component, ElementRef, OnInit } from '@angular/core';
import { CacheService } from '../../../shared/auth/cache.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AppService } from '../../../shared/client/v1/app.service';
import {
  KubeApiTypeConfigMap,
  KubeApiTypeCronJob,
  KubeApiTypeDaemonSet,
  KubeApiTypeDeployment,
  KubeApiTypePersistentVolumeClaim,
  KubeApiTypeSecret,
  KubeApiTypeService,
  KubeApiTypeStatefulSet
} from '../../../shared/shared.const';
import { Cluster } from '../../app/list-cluster/cluster';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {
  resources: object = new Object();
  clusters: string[] = [];
  clusterList: Cluster[] = [];
  showNumber = 10;
  resourceCountMap: any;
  readonly deployment = KubeApiTypeDeployment;
  readonly cronJob = KubeApiTypeCronJob;
  readonly statefulSet = KubeApiTypeStatefulSet;
  readonly daemonSet = KubeApiTypeDaemonSet;
  readonly service = KubeApiTypeService;
  readonly configMap = KubeApiTypeConfigMap;
  readonly secret = KubeApiTypeSecret;
  readonly persistentVolumeClaim = KubeApiTypePersistentVolumeClaim;

  constructor(public cacheService: CacheService,
              private element: ElementRef,
              private namespaceClient: NamespaceClient,
              private appService: AppService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {

  }

  ngOnInit() {
    this.initResourceCount();
    this.initResourceUsage();
  }

  initResourceCount() {
    this.appService.listResourceCount(this.cacheService.namespaceId).subscribe(
      response => {
        this.resourceCountMap = response.data;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  resourceCount(resource: string): number {
    if (this.resourceCountMap) {
      return this.resourceCountMap[resource];
    }
    return 0;
  }

  initResourceUsage() {
    this.namespaceClient.getResourceUsage(this.cacheService.namespaceId).subscribe(
      response => {
        this.resources = response.data;
        this.clusterList = Object.keys(this.resources).map(item => {
          const a = new Cluster();
          a['cluster'] = item;
          a['resource'] = this.resources[item];
          return a;
        });
        Object.getOwnPropertyNames(this.resources).forEach(cluster => {
          this.clusters.push(cluster);
        });
        this.showNumber = this.getClusterMaxNumber();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  dealLimitLogic(value: number): number {
    return value === 0 ? Infinity : value;
  }

  getClusterMaxNumber() {
    return Math.floor((this.element.nativeElement.querySelector('.clr-col-sm-10').offsetWidth * 0.83 - 20) / 140);
  }

  showMoreCluster() {
    this.showNumber = this.clusters.length;
  }
}
