import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PersistentVolumeClaimService } from '../../shared/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaimTplService } from '../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimClient } from '../../shared/client/v1/kubernetes/persistentvolumeclaims';
import { PersistentVolumeClaimComponent } from './persistentvolumeclaim.component';
import { ListPersistentVolumeClaimComponent } from './list-persistentvolumeclaim/list-persistentvolumeclaim.component';
import { CreateEditPersistentVolumeClaimComponent } from './create-edit-persistentvolumeclaim/create-edit-persistentvolumeclaim.component';
import { PublishPersistentVolumeClaimTplComponent } from './publish-tpl/publish-tpl.component';
import {
  CreateEditPersistentVolumeClaimTplComponent
} from './create-edit-persistentvolumeclaimtpl/create-edit-persistentvolumeclaimtpl.component';
import { RouterModule } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { SnapshotPersistentVolumeClaimComponent } from './snapshot-persistentvolumeclaim/snapshot-persistentvolumeclaim.component';
import { CreateSnapshotComponent } from './create-snapshot/create-snapshot.component';
import { PersistentVolumeClaimRobinClient } from '../../shared/client/v1/kubernetes/persistentvolumeclaims-robin';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    PersistentVolumeClaimService,
    PersistentVolumeClaimTplService,
    PersistentVolumeClaimClient,
    PersistentVolumeClaimRobinClient
  ],
  exports: [
    PersistentVolumeClaimComponent,
  ],
  declarations: [
    PersistentVolumeClaimComponent,
    ListPersistentVolumeClaimComponent,
    CreateEditPersistentVolumeClaimComponent,
    CreateEditPersistentVolumeClaimTplComponent,
    PublishPersistentVolumeClaimTplComponent,
    UserInfoComponent,
    SnapshotPersistentVolumeClaimComponent,
    CreateSnapshotComponent
  ]
})

export class PersistentVolumeClaimModule {
}
