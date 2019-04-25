import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import { ConfigMap } from 'wayne-component/lib/model/v1/configmap';
import { ConfigMapService } from 'wayne-component/lib/client/v1/configmap.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditResource } from 'wayne-component/lib/base/resource/create-edit-resource';
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
    return this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }
}

