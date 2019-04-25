import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import 'rxjs/add/observable/combineLatest';
import { Deployment } from 'wayne-component/lib/model/v1/deployment';
import { DeploymentService } from 'wayne-component/lib/client/v1/deployment.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditLimitResource } from 'wayne-component/lib/base/resource/create-edit-limit-resource';

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


