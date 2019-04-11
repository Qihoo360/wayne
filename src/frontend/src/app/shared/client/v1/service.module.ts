import { NgModule } from '@angular/core';
import { TipDirective } from './tip.directive';
@NgModule({
  declarations: [TipDirective],
  exports: [TipDirective]
})
export class ServiceModule { }
