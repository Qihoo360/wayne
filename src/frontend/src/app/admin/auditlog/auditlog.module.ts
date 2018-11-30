import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuditLogService } from '../../shared/client/v1/auditlog.service';
import { AuditLogComponent } from './auditlog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    AuditLogService
  ],
  exports: [
    AuditLogComponent
  ],
  declarations: [
    AuditLogComponent
  ]
})

export class AuditLogModule {
}
