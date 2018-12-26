import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceLimitComponent } from './resource-limit.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FormsModule,
    TranslateModule
  ],
  declarations: [
    ResourceLimitComponent
  ],
  exports: [
    ResourceLimitComponent
  ]
})
export class ResourceLimitModule { }
