import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CreateEditAppComponent } from './create-edit-app/create-edit-app.component';
import { ListAppComponent } from './list-app/list-app.component';
import { SharedModule } from '../../shared/shared.module';
import { TrashAppComponent } from './trash-app/trash-app.component';
import { AppService } from '../../shared/client/v1/app.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    AppService
  ],
  exports: [
    AppComponent,
    ListAppComponent
  ],
  declarations: [
    AppComponent,
    ListAppComponent,
    CreateEditAppComponent,
    TrashAppComponent
  ]
})

export class AppModule {
}
