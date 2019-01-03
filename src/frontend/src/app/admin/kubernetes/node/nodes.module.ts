import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NodesComponent } from './nodes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NodeClient } from '../../../shared/client/v1/kubernetes/node';
import { ListNodesComponent } from './list-nodes/list-nodes.component';

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
    ListNodesComponent
  ]
})

export class NodesModule {
}
