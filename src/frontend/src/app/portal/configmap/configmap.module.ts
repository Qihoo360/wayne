import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateEditConfigMapComponent } from './create-edit-configmap/create-edit-configmap.component';
import { ConfigMapComponent } from './configmap.component';
import { ListConfigMapComponent } from './list-configmap/list-configmap.component';
import { CreateEditConfigMapTplComponent } from './create-edit-configmaptpl/create-edit-configmaptpl.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PublishConfigMapTplComponent } from './publish-tpl/publish-tpl.component';
import { ConfigMapClient } from '../../shared/client/v1/kubernetes/configmap';
import { ConfigMapService } from '../../shared/client/v1/configmap.service';
import { ConfigMapTplService } from '../../shared/client/v1/configmaptpl.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    ConfigMapService,
    ConfigMapTplService,
    ConfigMapClient
  ],
  exports: [
    ConfigMapComponent
  ],
  declarations: [
    ConfigMapComponent,
    ListConfigMapComponent,
    CreateEditConfigMapComponent,
    CreateEditConfigMapTplComponent,
    PublishConfigMapTplComponent,
  ]
})

export class ConfigMapModule {
}
