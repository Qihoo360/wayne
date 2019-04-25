import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import { Secret } from 'wayne-component/lib/model/v1/secret';
import { SecretService } from 'wayne-component/lib/client/v1/secret.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditResource } from 'wayne-component/lib/base/resource/create-edit-resource';

@Component({
  selector: 'create-edit-secret',
  templateUrl: 'create-edit-secret.component.html',
  styleUrls: ['create-edit-secret.scss']
})
export class CreateEditSecretComponent extends CreateEditResource {
  constructor(
    public secretService: SecretService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService) {
    super(secretService, authService, messageHandlerService);
    this.registResource(new Secret);
    this.registResourceType('加密字典');
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

