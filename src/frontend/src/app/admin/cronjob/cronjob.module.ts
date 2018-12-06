import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CronjobComponent } from './cronjob.component';
import { ListCronjobComponent } from './list-cronjob/list-cronjob.component';
import { CreateEditCronjobComponent } from './create-edit-cronjob/create-edit-cronjob.component';
import { TrashCronjobComponent } from './trash-cronjob/trash-cronjob.component';
import { CronjobService } from '../../shared/client/v1/cronjob.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    CronjobService
  ],
  exports: [CronjobComponent,
    ListCronjobComponent],
  declarations: [CronjobComponent,
    ListCronjobComponent, CreateEditCronjobComponent, TrashCronjobComponent]
})

export class CronjobModule {
}
