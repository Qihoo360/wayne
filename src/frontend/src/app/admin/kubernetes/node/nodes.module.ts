import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NodesComponent } from './nodes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NodeClient } from 'wayne-component/lib/client/v1/kubernetes/node';
import { ListNodesComponent } from './list-nodes/list-nodes.component';
import { NodeResourceComponent } from './node-resource/node-resource.component';
@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    NodeClient
  ],
  exports: [
    NodesComponent,
    ListNodesComponent,
  ],
  declarations: [
    NodesComponent,
    ListNodesComponent,
    NodeResourceComponent
  ]
})

export class NodesModule {
}
