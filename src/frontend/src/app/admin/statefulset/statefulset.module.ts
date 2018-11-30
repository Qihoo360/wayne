import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListStatefulsetComponent } from './list-statefulset/list-statefulset.component';
import { CreateEditStatefulsetComponent } from './create-edit-statefulset/create-edit-statefulset.component';
import { StatefulsetComponent } from './statefulset.component';
import { StatefulsetService } from '../../shared/client/v1/statefulset.service';
import { TrashStatefulsetComponent } from './trash-statefulset/trash-statefulset.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    StatefulsetService
  ],
  exports: [StatefulsetComponent,
    ListStatefulsetComponent],
  declarations: [StatefulsetComponent,
    ListStatefulsetComponent, TrashStatefulsetComponent, CreateEditStatefulsetComponent]
})

export class StatefulsetModule {
}
