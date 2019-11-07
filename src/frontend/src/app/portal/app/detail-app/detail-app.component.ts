import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { Cluster } from '../list-cluster/cluster';
import { ListClusterComponent } from '../list-cluster/list-cluster.component';
import { RedDot } from '../../../shared/model/v1/red-dot';
import { StorageService } from '../../../shared/client/v1/storage.service';
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
import { EventManager } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CreateEditAppComponent } from '../create-edit-app/create-edit-app.component';

@Component({
  selector: 'detail-app',
  templateUrl: 'detail-app.component.html',
  styleUrls: ['detail-app.scss']
})
export class DetailAppComponent implements OnInit, OnDestroy {
  @ViewChild(CreateEditAppComponent, { static: false })
  createEditApp: CreateEditAppComponent;

  appId: number;
  app: App = new App();
  resources: any;
  clusters: string[] = [];
  clusterList: Cluster[] = [];
  redDot: RedDot = new RedDot();

  resourceCountMap: any;
  readonly deployment = KubeApiTypeDeployment;
  readonly cronJob = KubeApiTypeCronJob;
  readonly statefulSet = KubeApiTypeStatefulSet;
  readonly daemonSet = KubeApiTypeDaemonSet;
  readonly service = KubeApiTypeService;
  readonly configMap = KubeApiTypeConfigMap;
  readonly secret = KubeApiTypeSecret;
  readonly persistentVolumeClaim = KubeApiTypePersistentVolumeClaim;

  @ViewChild(ListClusterComponent, { static: false }) listCluster: ListClusterComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public cacheService: CacheService,
              private appService: AppService,
              private namespaceClient: NamespaceClient,
              public authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              private element: ElementRef,
              private storage: StorageService,
              private eventManager: EventManager,
              public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initRedDot();
    this.appId = this.route.parent.snapshot.params['id'];
    const namespaceId = this.cacheService.namespaceId;
    this.appService.getById(this.appId, namespaceId).subscribe(response => {
        this.app = response.data;
        this.namespaceClient.getResourceUsage(namespaceId, response.data.name).subscribe(
          next => {
            this.resources = next.data;
            this.clusterList = Object.keys(this.resources).map(item => {
              const a = new Cluster();
              a['cluster'] = item;
              a['resource'] = this.resources[item];
              return a;
            });
            Object.getOwnPropertyNames(this.resources).forEach(cluster => {
              this.clusters.push(cluster);
            });
          },
          error => this.messageHandlerService.handleError(error)
        );
      },
      error => this.messageHandlerService.handleError(error));

    this.initResourceCount();
  }

  ngOnDestroy() {
  }

  goToLink(type: string) {
    this.router.navigateByUrl(`/portal/namespace/${this.cacheService.namespaceId}/app/${this.appId}/${type}`);
  }

  initResourceCount() {
    this.appService.listResourceCount(this.cacheService.namespaceId, this.appId).subscribe(
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

  initRedDot() {
    // 这个组件需要的红点判断列表
    const redList = ['detailShowCluster'];
    if (this.storage.get('red-dot')) {
      const redDot = JSON.parse(this.storage.get('red-dot'));
      redList.forEach(item => {
        if (redDot[item]) {
          this.redDot[item] = false;
        } else {
          this.redDot[item] = true;
        }
      });
    } else {
      redList.forEach(item => {
        this.redDot[item] = true;
      });
    }
  }

  setRedDot(value: string) {
    if (this.storage.get('red-dot')) {
      const redDot = JSON.parse(this.storage.get('red-dot'));
      if (!redDot[value]) {
        redDot[value] = true;
        this.storage.save('red-dot', JSON.stringify(redDot));
      }
    } else {
      const redDot = new RedDot();
      redDot[value] = true;
      this.storage.save('red-dot', JSON.stringify(redDot));
    }
    this.redDot[value] = false;
  }

  showMoreCluster() {
    this.setRedDot('detailShowCluster');
    this.listCluster.open();
  }

  getClusterMaxNumber() {
    return Math.floor((this.element.nativeElement.querySelector('.form-box').offsetWidth * 0.83 - 20) / 140);
  }

  dealLimitLogic(value: number): number {
    return value === 0 ? Infinity : value;
  }

  editApp(app: App) {
    this.createEditApp.newOrEditApp(app.id);
  }

  updateAppEvent(update: boolean) {
    if (update) {
      this.appService.getById(this.appId, this.cacheService.namespaceId).subscribe(response => {
          this.app = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );
    }
  }
}
