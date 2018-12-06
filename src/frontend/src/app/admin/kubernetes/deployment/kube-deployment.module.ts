import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { KubeDeploymentComponent } from './kube-deployment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeploymentClient } from '../../../shared/client/v1/kubernetes/deployment';
import { KubeListDeploymentComponent } from './list/kube-list-deployment.component';
import { KubeMigrationDeploymentComponent } from './migration/kube-migration-deployment.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    DeploymentClient
  ],
  exports: [
    KubeDeploymentComponent,
    KubeListDeploymentComponent,
    KubeMigrationDeploymentComponent
  ],
  declarations: [
    KubeDeploymentComponent,
    KubeListDeploymentComponent,
    KubeMigrationDeploymentComponent
  ]
})

export class KubeDeploymentModule {
}
