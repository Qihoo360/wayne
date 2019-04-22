import { NgModule } from '@angular/core';
import { ListEventComponent } from './list-event.component';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [ClarityModule, TranslateModule, BrowserModule],
  declarations: [ListEventComponent],
  exports: [ListEventComponent]
})
export class ListEventModule { }
