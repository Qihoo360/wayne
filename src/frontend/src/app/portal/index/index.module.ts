import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IndexComponent } from './index.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [],
  exports: [IndexComponent
  ],
  declarations: [IndexComponent]
})

export class IndexModule {
}
