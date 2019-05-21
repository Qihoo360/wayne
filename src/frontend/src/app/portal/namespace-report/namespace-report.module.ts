import { NgModule } from '@angular/core';
import { NamespaceReportComponent } from './namespace-report.component';
import { SharedModule } from '../../shared/shared.module';
import { HistoryComponent } from './history/history.component';
import { ResourceComponent } from './resource/resource.component';
import { SidenavNamespaceModule } from '../sidenav-namespace/sidenav-namespace.module';
import { OverviewComponent } from './overview/overview.component';
import { NamespaceService } from '../../shared/client/v1/namespace.service';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule
  ],
  providers: [
    NamespaceService
  ],
  exports: [
    NamespaceReportComponent,
  ],
  declarations: [
    NamespaceReportComponent,
    HistoryComponent,
    ResourceComponent,
    OverviewComponent
  ]
})

export class NamespaceReportModule {
}
