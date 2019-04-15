import { NgModule } from '@angular/core';
import { DropDownComponent } from './dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [BrowserModule],
  declarations: [DropDownComponent],
  exports: [DropDownComponent]
})
export class DropDownModule { }
