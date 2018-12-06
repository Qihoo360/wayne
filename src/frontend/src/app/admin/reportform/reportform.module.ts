import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AppReportFormComponent } from './app/app-reportform.component';
import { AppService } from '../../shared/client/v1/app.service';
import { OverviewComponent } from './overview/overview.component';
import { DeployComponent } from './deploy/deploy.component';
import { PublishService } from '../../shared/client/v1/publish.service';
import { NodeClient } from '../../shared/client/v1/kubernetes/node';
import { PodClient } from '../../shared/client/v1/kubernetes/pod';
import { UserService } from '../../shared/client/v1/user.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    AppService,
    PublishService,
    NodeClient,
    PodClient,
    UserService
  ],
  exports: [AppReportFormComponent, OverviewComponent, DeployComponent],
  declarations: [AppReportFormComponent, OverviewComponent, DeployComponent]
})

export class ReportFormModule {
}
