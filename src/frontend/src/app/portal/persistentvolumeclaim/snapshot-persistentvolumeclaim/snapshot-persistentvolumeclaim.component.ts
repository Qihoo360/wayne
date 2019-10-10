import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets, TemplateState } from '../../../shared/shared.const';
import { PersistentVolumeClaimClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { CreateSnapshotComponent } from '../create-snapshot/create-snapshot.component';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { PersistentVolumeClaimRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims-robin';

@Component({
  selector: 'snapshot-persistentvolumeclaim',
  templateUrl: 'snapshot-persistentvolumeclaim.component.html',
  styleUrls: ['snapshot-persistentvolumeclaim.scss']
})


export class SnapshotPersistentVolumeClaimComponent implements OnInit, OnDestroy {
  @Input() state: PublishStatus;
  @Input() appId: number;

  @ViewChild(CreateSnapshotComponent, { static: false })
  createSnapshot: CreateSnapshotComponent;
  subscription: Subscription;



  constructor(private pvcClient: PersistentVolumeClaimClient,
              private persistentVolumeClaimRobinClient: PersistentVolumeClaimRobinClient,
              private route: ActivatedRoute,
              private confirmationDialogService: ConfirmationDialogService,
              private messageHandlerService: MessageHandlerService) {
    this.subscription = confirmationDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT_ALL) {
        const state = message.data;
        this.persistentVolumeClaimRobinClient
          .deleteAllSnapshot(this.appId, state.cluster, state.pvc.metadata.namespace, state.pvc.metadata.name)
          .subscribe(
            response => {
              this.snapshotRefresh();
              this.messageHandlerService.showSuccess('删除所有快照成功！');
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT) {
        const state = message.data.state;
        const name = message.data.name;
        this.persistentVolumeClaimRobinClient.deleteSnapshot(this.appId, state.cluster,
          state.pvc.metadata.namespace, state.pvc.metadata.name, name).subscribe(
          response => {
            this.snapshotRefresh();
            this.messageHandlerService.showSuccess('删除快照成功！');
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      }
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT_ROLLBACK) {
        const state = message.data.state;
        const name = message.data.name;
        this.persistentVolumeClaimRobinClient.rollBackSnapshot(this.appId,
          state.cluster, state.pvc.metadata.namespace, state.pvc.metadata.name, name).subscribe(
          response => {
            this.messageHandlerService.showSuccess('回滚快照成功！');
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      }
    });
  }


  openModal() {
    this.createSnapshot.createSnap(this.state);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createdSnapshot(created: boolean) {
    if (created) {
      this.snapshotRefresh();
    }
  }

  snapshotRefresh() {
    if (this.state.state === TemplateState.SUCCESS) {
      this.persistentVolumeClaimRobinClient.listSnapshot(this.appId,
        this.state.cluster, this.state.pvc.metadata.namespace, this.state.pvc.metadata.name).subscribe(
        response => {
          this.state.snaps = response.data.snaps;
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
    }
  }

  deleteSnap(name: string) {
    const deletionMessage = new ConfirmationMessage(
      '删除快照确认',
      `是否确认删除快照${name}?`,
      {'name': name, 'state': this.state},
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.confirmationDialogService.openComfirmDialog(deletionMessage);
  }

  deleteAllSnap() {
    const deletionMessage = new ConfirmationMessage(
      '删除快照确认',
      '是否确认删除所有快照，删除之后将无法恢复?',
      this.state,
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT_ALL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.confirmationDialogService.openComfirmDialog(deletionMessage);
  }

  rollbackSnap(name: string) {
    const deletionMessage = new ConfirmationMessage(
      '回滚快照确认',
      `是否确认到${name}版本`,
      {'name': name, 'state': this.state},
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_SNAPSHOT_ROLLBACK,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.confirmationDialogService.openComfirmDialog(deletionMessage);


  }

}
