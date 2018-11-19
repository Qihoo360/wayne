import {NgModule} from '@angular/core';
import {TplDetailComponent} from './tpl-detail.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
  ],
  exports: [TplDetailComponent],
  declarations: [TplDetailComponent
  ]
})

export class TplDetailModule {
}
