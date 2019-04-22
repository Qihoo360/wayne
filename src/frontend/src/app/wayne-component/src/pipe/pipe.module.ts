import { NgModule } from '@angular/core';
import { RelativeTimeFilterPipe } from './relative-time.filter.pipe';

@NgModule({
  declarations: [RelativeTimeFilterPipe],
  exports: [RelativeTimeFilterPipe]
})
export class PipeModule { }
