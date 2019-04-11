import { NgModule } from '@angular/core';
import { ClrIconModule } from '@clr/angular';
import { PageNotFoundComponent } from './not-found.component';

@NgModule({
  imports: [ClrIconModule],
  declarations: [PageNotFoundComponent],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
