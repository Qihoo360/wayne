import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceLimitComponent } from './resource-limit.component';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    ResourceLimitComponent
  ],
  exports: [
    ResourceLimitComponent
  ]
})
export class ResourceLimitModule { }
