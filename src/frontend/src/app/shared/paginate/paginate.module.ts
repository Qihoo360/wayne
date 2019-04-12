import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PaginateComponent } from './paginate.component';
import { BrowserModule } from '@angular/platform-browser';
import { SelectModule } from '../select/index';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [ClarityModule, TranslateModule, BrowserModule, SelectModule, FormsModule],
  declarations: [PaginateComponent],
  exports: [PaginateComponent]
})
export class PaginateModule { }
