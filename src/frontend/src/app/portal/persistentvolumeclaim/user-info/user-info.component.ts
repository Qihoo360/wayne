import { Component } from '@angular/core';
import { PersistentVolumeClaimLoginInfo } from '../../../shared/model/v1/persistentvolumeclaim';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.component.html'
})

export class UserInfoComponent {
  modalOpened: boolean;
  userInfo: PersistentVolumeClaimLoginInfo;

  openModal(userInfo: PersistentVolumeClaimLoginInfo) {
    this.userInfo = userInfo;
    this.modalOpened = true;
  }
}


