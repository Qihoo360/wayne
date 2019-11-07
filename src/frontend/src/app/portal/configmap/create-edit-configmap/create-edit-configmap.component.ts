import { Component } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { ConfigMapService } from '../../../shared/client/v1/configmap.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditResource } from '../../../shared/base/resource/create-edit-resource';
@Component({
  selector: 'create-edit-configmap',
  templateUrl: 'create-edit-configmap.component.html',
  styleUrls: ['create-edit-configmap.scss']
})
export class CreateEditConfigMapComponent extends CreateEditResource {
  constructor(
    public configMapService: ConfigMapService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService) {
    super(configMapService, authService, messageHandlerService);
    this.registResource(new ConfigMap);
    this.registResourceType('配置集');
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

