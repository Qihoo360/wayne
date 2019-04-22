import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';
import { OptionComponent } from './option/option.component';
import { InputModule } from '../input/index';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [InputModule, CommonModule, FormsModule, BrowserAnimationsModule],
  declarations: [SelectComponent, OptionComponent],
  exports: [SelectComponent, OptionComponent]
})
export class SelectModule { }
