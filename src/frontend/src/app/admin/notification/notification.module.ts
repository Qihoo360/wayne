import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { NotificationService } from '../../shared/client/v1/notification.service';
import { SharedModule } from '../../shared/shared.module';
import { SidenavNamespaceModule } from '../../portal/sidenav-namespace/sidenav-namespace.module';
import { CreateNotificationComponent } from './create-notification/create-notification.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    SharedModule,
    SidenavNamespaceModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [NotificationComponent, ListNotificationComponent, CreateNotificationComponent],
  providers: [
    NotificationService,
  ]
})
export class NotificationModule {
}
