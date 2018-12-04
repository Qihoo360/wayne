import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CronjobTplComponent } from './cronjobtpl.component';
import { ListCronjobTplComponent } from './list-cronjobtpl/list-cronjobtpl.component';
import { CreateEditCronjobTplComponent } from './create-edit-cronjobtpl/create-edit-cronjobtpl.component';
import { TrashCronjobTplComponent } from './trash-cronjobtpl/trash-cronjobtpl.component';
import { CronjobTplService } from '../../shared/client/v1/cronjobtpl.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    CronjobTplService
  ],
  exports: [CronjobTplComponent,
    ListCronjobTplComponent],
  declarations: [CronjobTplComponent,
    ListCronjobTplComponent, CreateEditCronjobTplComponent, TrashCronjobTplComponent]
})

export class CronjobTplModule {
}
