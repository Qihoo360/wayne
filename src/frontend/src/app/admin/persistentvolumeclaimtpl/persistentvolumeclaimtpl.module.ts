import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ListPersistentVolumeClaimTplComponent } from './list-persistentvolumeclaimtpl/list-persistentvolumeclaimtpl.component';
import { PersistentVolumeClaimTplComponent } from './persistentvolumeclaimtpl.component';
import {
  CreateEditPersistentVolumeClaimTplComponent
} from './create-edit-persistentvolumeclaimtpl/create-edit-persistentvolumeclaimtpl.component';
import { PersistentVolumeClaimTplService } from '../../shared/client/v1/persistentvolumeclaimtpl.service';
import { TrashPersistentVolumeClaimTplComponent } from './trash-persistentvolumeclaimtpl/trash-persistentvolumeclaimtpl.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    PersistentVolumeClaimTplService
  ],
  exports: [
    PersistentVolumeClaimTplComponent,
    ListPersistentVolumeClaimTplComponent
  ],
  declarations: [
    PersistentVolumeClaimTplComponent,
    ListPersistentVolumeClaimTplComponent,
    CreateEditPersistentVolumeClaimTplComponent,
    TrashPersistentVolumeClaimTplComponent
  ]
})

export class PersistentVolumeClaimTplModule {
}
