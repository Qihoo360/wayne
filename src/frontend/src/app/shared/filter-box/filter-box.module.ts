import { NgModule } from '@angular/core';
import { FilterBoxComponent } from './filter-box.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [TranslateModule],
  declarations: [FilterBoxComponent],
  exports: [FilterBoxComponent]
})
export class FilterBoxModule { }
