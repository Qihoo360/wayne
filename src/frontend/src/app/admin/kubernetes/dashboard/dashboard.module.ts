import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { KubernetesDashboardComponent, SafePipe } from './dashboard.component';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    ClusterService
  ],
  exports: [KubernetesDashboardComponent],
  declarations: [KubernetesDashboardComponent, SafePipe]
})

export class KubernetesDashboardModule {
}
