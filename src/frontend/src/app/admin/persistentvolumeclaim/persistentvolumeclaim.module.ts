import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PersistentVolumeClaimService } from '../../shared/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaimComponent } from './persistentvolumeclaim.component';
import { ListPersistentVolumeClaimComponent } from './list-persistentvolumeclaim/list-persistentvolumeclaim.component';
import { CreateEditPersistentVolumeClaimComponent } from './create-edit-persistentvolumeclaim/create-edit-persistentvolumeclaim.component';
import { TrashPersistentVolumeClaimComponent } from './trash-persistentvolumeclaim/trash-persistentvolumeclaim.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    PersistentVolumeClaimService
  ],
  exports: [
    PersistentVolumeClaimComponent,
    ListPersistentVolumeClaimComponent
  ],
  declarations: [
    PersistentVolumeClaimComponent,
    ListPersistentVolumeClaimComponent,
    CreateEditPersistentVolumeClaimComponent,
    TrashPersistentVolumeClaimComponent
  ]
})

export class PersistentVolumeClaimModule {
}
