import { NgModule } from '@angular/core';
import { TplDetailComponent } from './tpl-detail.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [
    ClarityModule
  ],
  providers: [],
  exports: [TplDetailComponent],
  declarations: [TplDetailComponent
  ]
})

export class TplDetailModule {
}
