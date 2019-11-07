import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PersistentVolumeClaimClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { NgForm } from '@angular/forms';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { ActivatedRoute } from '@angular/router';
import { PersistentVolumeClaimRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolumeclaims-robin';

@Component({
  selector: 'create-snapshot',
  templateUrl: 'create-snapshot.component.html',
  styleUrls: ['create-snapshot.scss']
})
export class CreateSnapshotComponent {
  createAppOpened: boolean;
  snapForm: NgForm;
  @ViewChild('snapForm', { static: true })
  currentForm: NgForm;
  @Input() appId: number;

  state: PublishStatus;
  snapshotVersion: string;
  @Output() create = new EventEmitter<boolean>();

  constructor(private pvcClient: PersistentVolumeClaimClient,
              private persistentVolumeClaimRobinClient: PersistentVolumeClaimRobinClient,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService) {

  }


  createSnap(state: PublishStatus) {
    this.state = state;
    this.snapshotVersion = null;
    this.createAppOpened = true;
  }

  onCancel() {
    this.createAppOpened = false;
    this.currentForm.reset();
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid;
  }

  onSubmit() {
    this.persistentVolumeClaimRobinClient.createSnapshot(this.appId, this.state.cluster,
      this.state.pvc.metadata.namespace, this.state.pvc.metadata.name, this.snapshotVersion).subscribe(
      response => {
        this.messageHandlerService.showSuccess('创建快照成功！');
        this.create.emit(true);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
    this.createAppOpened = false;
  }

}
