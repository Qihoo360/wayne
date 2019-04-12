import { NgModule } from '@angular/core';
import { ListPodComponent } from './list-pod.component';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { PaginateModule } from '../paginate/index';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../pipe/index';

@NgModule({
  imports: [ClarityModule, BrowserModule, PaginateModule, FormsModule, TranslateModule, PipeModule],
  declarations: [ListPodComponent],
  exports: [ListPodComponent],
  providers: []
})
export class ListPodModule { }
