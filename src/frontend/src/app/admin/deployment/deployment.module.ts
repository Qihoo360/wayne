import { NgModule } from '@angular/core';
import { DeploymentComponent } from './deployment.component';
import { CreateEditDeploymentComponent } from './create-edit-deployment/create-edit-deployment.component';
import { ListDeploymentComponent } from './list-deployment/list-deployment.component';
import { SharedModule } from '../../shared/shared.module';
import { TrashDeploymentComponent } from './trash-deployment/trash-deployment.component';
import { DeploymentService } from '../../shared/client/v1/deployment.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    DeploymentService
  ],
  exports: [DeploymentComponent,
    ListDeploymentComponent],
  declarations: [DeploymentComponent,
    ListDeploymentComponent, CreateEditDeploymentComponent, TrashDeploymentComponent]
})

export class DeploymentModule {
}
