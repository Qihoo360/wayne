import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import { PersistentVolumeClaimService } from 'wayne-component/lib/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaim } from 'wayne-component/lib/model/v1/persistentvolumeclaim';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditResource } from 'wayne-component/lib/base/resource/create-edit-resource';

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

