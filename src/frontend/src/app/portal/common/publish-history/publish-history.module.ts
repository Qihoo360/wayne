import { NgModule } from '@angular/core';
import { PublishHistoryComponent } from './publish-history.component';
import { SharedModule } from 'wayne-component/lib/shared.module';

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
