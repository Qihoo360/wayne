import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StatefulsetTplService } from '../../shared/client/v1/statefulsettpl.service';
import { ListStatefulsettplComponent } from './list-statefulsettpl/list-statefulsettpl.component';
import { CreateEditStatefulsettplComponent } from './create-edit-statefulsettpl/create-edit-statefulsettpl.component';
import { TrashStatefulsettplComponent } from './trash-statefulsettpl/trash-statefulsettpl.component';
import { StatefulsettplComponent } from './statefulsettpl.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    StatefulsetTplService
  ],
  exports: [StatefulsettplComponent,
    ListStatefulsettplComponent],
  declarations: [StatefulsettplComponent,
    ListStatefulsettplComponent, CreateEditStatefulsettplComponent, TrashStatefulsettplComponent]
})

export class StatefulsettplModule {
}
