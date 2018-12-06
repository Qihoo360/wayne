import { NgModule } from '@angular/core';
import { NavComponent } from './nav.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  providers: [],
  exports: [NavComponent],
  declarations: [NavComponent]
})

export class NavModule {
}
