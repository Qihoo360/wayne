import { NgModule } from '@angular/core';
import { ListEventDatagridComponent } from './list-event.component';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { PaginateModule } from '../paginate';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ClarityModule, BrowserModule, PaginateModule, TranslateModule],
  declarations: [ListEventDatagridComponent],
  exports: [ListEventDatagridComponent]
})
export class ListEventDatagridModule { }
