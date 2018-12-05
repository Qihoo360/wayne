import { NgModule } from '@angular/core';
import { TplDetailComponent } from './tpl-detail.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [],
  exports: [TplDetailComponent],
  declarations: [TplDetailComponent
  ]
})

export class TplDetailModule {
}
