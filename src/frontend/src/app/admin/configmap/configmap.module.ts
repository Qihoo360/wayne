import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConfigMapComponent } from './configmap.component';
import { ListConfigMapComponent } from './list-configmap/list-configmap.component';
import { CreateEditConfigMapComponent } from './create-edit-configmap/create-edit-configmap.component';
import { TrashConfigMapComponent } from './trash-configmap/trash-configmap.component';
import { ConfigMapService } from '../../shared/client/v1/configmap.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    ConfigMapService
  ],
  exports: [ConfigMapComponent,
    ListConfigMapComponent],
  declarations: [ConfigMapComponent,
    ListConfigMapComponent, CreateEditConfigMapComponent, TrashConfigMapComponent]
})

export class ConfigMapModule {
}
