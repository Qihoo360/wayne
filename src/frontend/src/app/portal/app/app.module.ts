import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CreateEditAppComponent } from './create-edit-app/create-edit-app.component';
import { ListAppComponent } from './list-app/list-app.component';
import { SharedModule } from '../../shared/shared.module';
import { DetailAppComponent } from './detail-app/detail-app.component';
import { AppService } from '../../shared/client/v1/app.service';
import { NamespaceService } from '../../shared/client/v1/namespace.service';
import { AppStarredService } from '../../shared/client/v1/appstarred.service';
import { NamespaceClient } from '../../shared/client/v1/kubernetes/namespace';
import { ListClusterComponent } from './list-cluster/list-cluster.component';
import { SidenavNamespaceModule } from '../sidenav-namespace/sidenav-namespace.module';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule
  ],
  providers: [
    AppService,
    NamespaceService,
    AppStarredService,
    NamespaceClient
  ],
  exports: [AppComponent,
    ListAppComponent,
    DetailAppComponent,
    ListClusterComponent
  ],
  declarations: [AppComponent,
    ListAppComponent,
    CreateEditAppComponent,
    DetailAppComponent,
    ListClusterComponent
  ]
})

export class AppModule {
}
