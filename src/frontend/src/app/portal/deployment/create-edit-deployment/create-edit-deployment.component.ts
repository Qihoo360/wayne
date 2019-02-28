import { Component } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import 'rxjs/add/observable/combineLatest';
import { Deployment } from '../../../shared/model/v1/deployment';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditLimitResource } from '../../../shared/base/resource/create-edit-limit-resource';

@Component({
  selector: 'create-edit-deployment',
  templateUrl: 'create-edit-deployment.component.html',
  styleUrls: ['create-edit-deployment.scss']
})

export class CreateEditDeploymentComponent extends CreateEditLimitResource {
  constructor(
    public deploymentService: DeploymentService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService) {
    super(deploymentService, authService, messageHandlerService);
    this.registResource(new Deployment());
    this.registResourceType('部署');
  }
}


