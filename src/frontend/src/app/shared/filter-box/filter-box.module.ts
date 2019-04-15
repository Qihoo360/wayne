import { NgModule } from '@angular/core';
import { FilterBoxComponent } from './filter-box.component';
import { TranslateModule } from '@ngx-translate/core';
import { BoxModule } from '../box';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [TranslateModule, BoxModule, BrowserModule],
  declarations: [FilterBoxComponent],
  exports: [FilterBoxComponent]
})
export class FilterBoxModule { }
