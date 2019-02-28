import { Component } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditResource } from '../../../shared/base/resource/create-edit-resource';

@Component({
  selector: 'create-edit-persistentvolumeclaim',
  templateUrl: 'create-edit-persistentvolumeclaim.component.html',
  styleUrls: ['create-edit-persistentvolumeclaim.scss']
})
export class CreateEditPersistentVolumeClaimComponent extends CreateEditResource {
  constructor(
    public pvcService: PersistentVolumeClaimService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService) {
    super(pvcService, authService, messageHandlerService);
    this.registResource(new PersistentVolumeClaim);
    this.registResourceType('PVC');
  }

  formatMetaData() {
    delete this.resource.metaData;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }
}

