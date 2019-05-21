import { NgModule } from '@angular/core';
import { PublishHistoryComponent } from './publish-history.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [],
  exports: [PublishHistoryComponent],
  declarations: [PublishHistoryComponent
  ]
})

export class PublishHistoryModule {
}
