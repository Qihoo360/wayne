import { NgModule } from '@angular/core';
import { AutoscaleComponent } from './autoscale.component';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateEditAutoscaleComponent } from './create-edit-autoscale/create-edit-autoscale.component';
import { CreateEditAutoscaletplComponent } from './create-edit-autoscaletpl/create-edit-autoscaletpl.component';
import { ListAutoscaleComponent } from './list-autoscale/list-autoscale.component';
import { AutoscaleService } from '../../shared/client/v1/autoscale.service';
import { AutoscaleTplService } from '../../shared/client/v1/autoscaletpl.service';
import { AutoscaleClient } from '../../shared/client/v1/kubernetes/autoscale';
import { PublishTplComponent } from './publish-tpl/publish-tpl.component';
import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    AutoscaleService,
    AutoscaleTplService,
    ClusterService,
    AutoscaleClient,
  ],
  exports: [
    AutoscaleComponent
  ],
  declarations: [
    AutoscaleComponent,
    CreateEditAutoscaleComponent,
    CreateEditAutoscaletplComponent,
    ListAutoscaleComponent,
    PublishTplComponent,
    StatusComponent
  ]
})

export class  AutoscaleModule {
}
