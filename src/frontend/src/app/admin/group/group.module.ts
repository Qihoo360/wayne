import { NgModule } from '@angular/core';
import { GroupComponent } from './group.component';
import { CreateEditGroupComponent } from './create-edit-group/create-edit-group.component';
import { ListGroupComponent } from './list-group/list-group.component';
import { SharedModule } from '../../shared/shared.module';
import { GroupService } from '../../shared/client/v1/group.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    GroupService
  ],
  exports: [
    GroupComponent,
    ListGroupComponent
  ],
  declarations: [
    GroupComponent,
    ListGroupComponent,
    CreateEditGroupComponent
  ]
})

export class GroupModule {
}
