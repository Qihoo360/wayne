import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DeploymentTplComponent } from './deploymenttpl.component';
import { ListDeploymentTplComponent } from './list-deploymenttpl/list-deploymenttpl.component';
import { CreateEditDeploymentTplComponent } from './create-edit-deploymenttpl/create-edit-deploymenttpl.component';
import { TrashDeploymentTplComponent } from './trash-deploymenttpl/trash-deploymenttpl.component';
import { DeploymentTplService } from '../../shared/client/v1/deploymenttpl.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    DeploymentTplService
  ],
  exports: [DeploymentTplComponent,
    ListDeploymentTplComponent],
  declarations: [DeploymentTplComponent,
    ListDeploymentTplComponent, CreateEditDeploymentTplComponent, TrashDeploymentTplComponent]
})

export class DeploymentTplModule {
}
