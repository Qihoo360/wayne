import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ListPersistentVolumeComponent } from './list-persistentvolume/list-persistentvolume.component';
import { PersistentVolume } from '../../../shared/model/v1/kubernetes/persistentvolume';
import { PersistentVolumeClient } from '../../../shared/client/v1/kubernetes/persistentvolume';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { Inventory } from './list-persistentvolume/inventory';
import { CreateEditPersistentVolumeComponent } from './create-edit-persistentvolume/create-edit-persistentvolume.component';
import { isArrayNotEmpty, isNotEmpty } from '../../../shared/utils';
import { AuthService } from '../../../shared/auth/auth.service';
import { PersistentVolumeRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolume-robin';

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
    let cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        if (data) {
          this.clusters = data.map(item => item.name);
          if (data.length > 0 && !this.cluster || this.clusters.indexOf(this.cluster) === -1) {
            cluster = cluster ? cluster : data[0].name;
          }
          this.jumpTo(cluster);
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  jumpTo(cluster: string) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/persistentvolume/${cluster}`);
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
                if (isNotEmpty(pv.spec.rbd) && rbdImages[pv.spec.rbd.image] && rbdImages[pv.spec.rbd.image].type == 'rbd') {
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
