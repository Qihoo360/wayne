import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListDaemonsetComponent } from './list-daemonset/list-daemonset.component';
import { CreateEditDaemonsetComponent } from './create-edit-daemonset/create-edit-daemonset.component';
import { DaemonsetComponent } from './daemonset.component';
import { DaemonSetService } from '../../shared/client/v1/daemonset.service';
import { TrashDaemonsetComponent } from './trash-daemonset/trash-daemonset.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    DaemonSetService
  ],
  exports: [DaemonsetComponent,
    ListDaemonsetComponent],
  declarations: [DaemonsetComponent,
    ListDaemonsetComponent, TrashDaemonsetComponent, CreateEditDaemonsetComponent]
})

export class DaemonsetModule {
}
