import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DaemonSetTplService } from '../../shared/client/v1/daemonsettpl.service';
import { ListDaemonsettplComponent } from './list-daemonsettpl/list-daemonsettpl.component';
import { CreateEditDaemonsettplComponent } from './create-edit-daemonsettpl/create-edit-daemonsettpl.component';
import { TrashDaemonsettplComponent } from './trash-daemonsettpl/trash-daemonsettpl.component';
import { DaemonsettplComponent } from './daemonsettpl.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    DaemonSetTplService
  ],
  exports: [DaemonsettplComponent,
    ListDaemonsettplComponent],
  declarations: [DaemonsettplComponent,
    ListDaemonsettplComponent, CreateEditDaemonsettplComponent, TrashDaemonsettplComponent]
})

export class DaemonsettplModule {
}
