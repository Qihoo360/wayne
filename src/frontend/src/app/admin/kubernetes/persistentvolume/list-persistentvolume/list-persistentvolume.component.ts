import { Component, EventEmitter, Input, OnInit, Output , OnDestroy } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { NameComparator, NameFilter, PvcFilter, RbdImageNameFilter, TimeComparator } from './inventory';
import { SortOrder } from '@clr/angular';
import { PersistentVolume } from '../../../../shared/model/v1/kubernetes/persistentvolume';
import { isEmpty } from '../../../../shared/utils';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../../shared/shared.const';
import { ConfirmationMessage } from '../../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { PersistentVolumeClient } from '../../../../shared/client/v1/kubernetes/persistentvolume';
import { MessageHandlerService } from '../../../../shared/message-handler/message-handler.service';
import { AuthService } from '../../../../shared/auth/auth.service';
import { PersistentVolumeRobinClient } from '../../../../shared/client/v1/kubernetes/persistentvolume-robin';
import { StorageService } from '../../../../shared/client/v1/storage.service';

@Component({
  selector: 'list-persistentvolume',
  templateUrl: 'list-persistentvolume.component.html'
})

export class ListPersistentVolumeComponent implements OnInit, OnDestroy {
  @Input() persistentVolumes: PersistentVolume[];
  @Input() cluster: string;
  @Input() showState: object;
  sortOrder: SortOrder = SortOrder.Unsorted;
  sorted = false;
  currentPage = 1;
  _pageSize = 10;
  timeComparator = new TimeComparator();
  nameComparator = new NameComparator();
  nameFilter = new NameFilter();
  rbdImageNameFilter = new RbdImageNameFilter;
  pvcFilter = new PvcFilter();
  @Output() delete = new EventEmitter<PersistentVolume>();
  @Output() edit = new EventEmitter<PersistentVolume>();
  @Output() refresh = new EventEmitter<boolean>();
  pageSizes: number[] = new Array(10, 20, 50);

  subscription: Subscription;

  constructor(private confirmationDialogService: ConfirmationDialogService,
              private messageHandlerService: MessageHandlerService,
              private authService: AuthService,
              private persistentVolumeClient: PersistentVolumeClient,
              private persistentVolumeClientRobin: PersistentVolumeRobinClient,
              private storage: StorageService) {
    this.subscription = confirmationDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_RBD_IMAGES) {
        const pv: PersistentVolume = message.data;
        this.persistentVolumeClientRobin
          .createRbdImage(pv, this.cluster)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('创建镜像成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(page: number) {
    if (page && this.pageSizes.indexOf(page) > -1) {
      this.storage.save('pagesize', page);
    }
    if (page !== this._pageSize) {
      this._pageSize = page;
    }
  }

  ngOnInit(): void {
    this._pageSize = parseInt(this.storage.get('pagesize') || '10',10);
  }

  retrieve() {
    this.refresh.emit(true);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get isEnableRobin(): boolean {
    return this.authService.config['enableRobin'];
  }

  createRbdImage(pv: PersistentVolume) {
    const deletionMessage = new ConfirmationMessage(
      '创建镜像确认',
      '是否确认创建镜像？',
      pv,
      ConfirmationTargets.PERSISTENT_VOLUME_RBD_IMAGES,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.confirmationDialogService.openComfirmDialog(deletionMessage);
  }

  createdRbdImage(pv: PersistentVolume) {
    if (isEmpty(pv.spec.rbd)) {
      return '';
    }
    return pv.spec.rbd.created === true ? '是' : '否';
  }

  createdCephfsPath(pv: PersistentVolume) {
    if (isEmpty(pv.spec.cephfs)) {
      return '';
    }
    return pv.spec.cephfs.created === true ? '是' : '否';
  }

  editPv(pv: PersistentVolume) {
    this.edit.emit(pv);
  }

  deletePv(pv: PersistentVolume) {
    this.delete.emit(pv);
  }

}


