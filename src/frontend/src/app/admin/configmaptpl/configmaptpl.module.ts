import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConfigMapTplComponent } from './configmaptpl.component';
import { ListConfigMapTplComponent } from './list-configmaptpl/list-configmaptpl.component';
import { CreateEditConfigMapTplComponent } from './create-edit-configmaptpl/create-edit-configmaptpl.component';
import { TrashConfigMapTplComponent } from './trash-configmaptpl/trash-configmaptpl.component';
import { ConfigMapTplService } from '../../shared/client/v1/configmaptpl.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    ConfigMapTplService
  ],
  exports: [ConfigMapTplComponent,
    ListConfigMapTplComponent],
  declarations: [ConfigMapTplComponent,
    ListConfigMapTplComponent, CreateEditConfigMapTplComponent, TrashConfigMapTplComponent]
})

export class ConfigMapTplModule {
}
