import { NgModule } from '@angular/core';
import { DeploymentComponent } from './deployment.component';
import { SharedModule } from '../../shared/shared.module';
import { ListDeploymentComponent } from './list-deployment/list-deployment.component';
import { CreateEditDeploymentComponent } from './create-edit-deployment/create-edit-deployment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateEditDeploymentTplComponent } from './create-edit-deploymenttpl/create-edit-deploymenttpl.component';
import { PublishDeploymentTplComponent } from './publish-tpl/publish-tpl.component';
import { DeploymentClient } from 'wayne-component/lib/client/v1/kubernetes/deployment';
import { PodClient } from 'wayne-component/lib/client/v1/kubernetes/pod';
import { DeploymentService } from 'wayne-component/lib/client/v1/deployment.service';
import { DeploymentTplService } from 'wayne-component/lib/client/v1/deploymenttpl.service';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { PublicService } from 'wayne-component/lib/client/v1/public.service';
import { PublishStatusService } from 'wayne-component/lib/client/v1/publishstatus.service';
import { LogClient } from 'wayne-component/lib/client/v1/kubernetes/log';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    DeploymentService,
    DeploymentTplService,
    ClusterService,
    DeploymentClient,
    PublicService,
    PodClient,
    PublishStatusService,
    LogClient
  ],
  exports: [
    DeploymentComponent
  ],
  declarations: [
    DeploymentComponent,
    CreateEditDeploymentComponent,
    ListDeploymentComponent,
    CreateEditDeploymentTplComponent,
    PublishDeploymentTplComponent,
  ]
})

export class DeploymentModule {
}
