import { NgModule } from '@angular/core';
import { PublishHistoryComponent } from './publish-history.component';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PaginateModule } from '../paginate';
@NgModule({
  imports: [ClarityModule, BrowserModule, TranslateModule, PaginateModule],
  declarations: [PublishHistoryComponent],
  exports: [PublishHistoryComponent],
})

export class PublishHistoryModule {
}
