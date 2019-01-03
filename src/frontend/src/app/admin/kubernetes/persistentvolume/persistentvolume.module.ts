import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { PersistentVolumeClient } from '../../../shared/client/v1/kubernetes/persistentvolume';
import { PersistentVolumeComponent } from './persistentvolume.component';
import { ListPersistentVolumeComponent } from './list-persistentvolume/list-persistentvolume.component';
import { CreateEditPersistentVolumeComponent } from './create-edit-persistentvolume/create-edit-persistentvolume.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PersistentVolumeRobinClient } from '../../../shared/client/v1/kubernetes/persistentvolume-robin';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    PersistentVolumeClient,
    PersistentVolumeRobinClient
  ],
  exports: [
    PersistentVolumeComponent,
    ListPersistentVolumeComponent,
    CreateEditPersistentVolumeComponent,
  ],
  declarations: [
    PersistentVolumeComponent,
    CreateEditPersistentVolumeComponent,
    ListPersistentVolumeComponent
  ]
})

export class PersistentVolumeModule {
}
