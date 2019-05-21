import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { ListPersistentVolumeComponent } from './list-persistentvolume/list-persistentvolume.component';
import { PersistentVolume } from 'wayne-component/lib/model/v1/kubernetes/persistentvolume';
import { PersistentVolumeClient } from 'wayne-component/lib/client/v1/kubernetes/persistentvolume';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { Inventory } from './list-persistentvolume/inventory';
import { CreateEditPersistentVolumeComponent } from './create-edit-persistentvolume/create-edit-persistentvolume.component';
import { isArrayNotEmpty, isNotEmpty } from 'wayne-component/lib/utils';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { PersistentVolumeRobinClient } from 'wayne-component/lib/client/v1/kubernetes/persistentvolume-robin';

const showState = {
  '名称': {hidden: false},
  '总量': {hidden: false},
  '回收策略': {hidden: true},
  'access_pattern': {hidden: false},
  '状态': {hidden: false},
  '已绑定PVC': {hidden: false},
  '原因': {hidden: true},
  '开始时间': {hidden: false},
};

@Component({
  selector: 'wayne-persistentvolume',
  providers: [Inventory],
  templateUrl: './persistentvolume.component.html',
  styleUrls: ['./persistentvolume.component.scss']
})
export class PersistentVolumeComponent implements OnInit, OnDestroy {
  @ViewChild(ListPersistentVolumeComponent)
  list: ListPersistentVolumeComponent;
  @ViewChild(CreateEditPersistentVolumeComponent)
  createEdit: CreateEditPersistentVolumeComponent;
  cluster: string;
  clusters: Array<any>;
  persistentVolumes: PersistentVolume[];

  showState: object = showState;
  showList: any[] = new Array();

  subscription: Subscription;

  constructor(private persistentVolumeClient: PersistentVolumeClient,
              private persistentVolumeRobinClient: PersistentVolumeRobinClient,
              private route: ActivatedRoute,
              private inventory: Inventory,
              private router: Router,
              private clusterService: ClusterService,
              private authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME) {
        const name = message.data;
        this.persistentVolumeClient
          .deleteById(name, this.cluster)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('持久化存储删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  ngOnInit() {
    this.initShow();
    this.clusterService.getNames().subscribe(
      response => {
        this.clusters = response.data.map(item => item.name);
        const initCluster = this.getCluster();
        this.setCluster(initCluster);
        this.jumpToHref(initCluster);
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  setCluster(cluster?: string) {
    this.cluster = cluster;
    localStorage.setItem('cluster', cluster);
  }

  getCluster() {
    const localStorageCluster = localStorage.getItem('cluster');
    if (localStorageCluster && this.clusters.indexOf(localStorageCluster.toString()) > -1) {
      return localStorageCluster.toString();
    }
    return this.clusters[0];
  }

  jumpToHref(cluster: string) {
    this.setCluster(cluster);
    this.retrieve();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh(refresh: boolean) {
    if (refresh) {
      this.retrieve();
    }
  }

  get isEnableRobin(): boolean {
    return this.authService.config['enableRobin'];
  }

  retrieve(): void {
    if (!this.cluster) {
      return;
    }

    this.persistentVolumeClient.list(this.cluster).subscribe(
      response => {
        const pvs = response.data;
        this.inventory.size = pvs.length;
        this.inventory.reset(pvs);
        this.persistentVolumes = this.inventory.all;
        if (this.isEnableRobin) {
          this.persistentVolumeRobinClient.listRbdImages(this.cluster).
          subscribe(
            response2 => {
              const rbdImages = {};
              if (isNotEmpty(response2.data) && isArrayNotEmpty(response2.data.images)) {
                for (const rbd of response2.data.images) {
                  rbdImages[rbd.name] = rbd;
                }
              }
              for (const pv of pvs) {
                if (isNotEmpty(pv.spec.rbd) && rbdImages[pv.spec.rbd.image] && rbdImages[pv.spec.rbd.image].type === 'rbd') {
                  pv.spec.rbd.created = true;
                } else if (isNotEmpty(pv.spec.cephfs)) {
                  const name = this.getCephfsName(pv.spec.cephfs.path);
                  if (rbdImages[name] && rbdImages[name].type === 'cephfs') {
                    pv.spec.cephfs.created = true;
                  }
                }
              }
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
        }

      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  getCephfsName(path: string): string {
    const paths = path.split('/');
    return paths[paths.length - 1];
  }

  openModal(): void {
    this.router.navigate([`/admin/kubernetes/persistentvolume/${this.cluster}/edit`]);
  }

  editPv(pv: PersistentVolume) {
    this.router.navigate([`/admin/kubernetes/persistentvolume/${this.cluster}/edit/${pv.metadata.name}`]);
  }

  deletePv(pv: PersistentVolume) {
    const deletionMessage = new ConfirmationMessage(
      '删除持久化存储确认',
      '你确认删除持久化存储 ' + pv.metadata.name + ' ？',
      pv.metadata.name,
      ConfirmationTargets.PERSISTENT_VOLUME,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

}
