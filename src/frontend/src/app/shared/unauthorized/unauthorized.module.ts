import { NgModule } from '@angular/core';
import { ClrIconModule } from '@clr/angular';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [ClrIconModule],
  declarations: [UnauthorizedComponent],
  exports: [UnauthorizedComponent]
})
export class UnauthorizedModule { }
