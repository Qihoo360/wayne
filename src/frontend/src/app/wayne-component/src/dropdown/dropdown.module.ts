import { NgModule } from '@angular/core';
import { DropDownComponent } from './dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownItemComponent } from './item/dropdown-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule],
  declarations: [DropDownComponent, DropdownItemComponent],
  exports: [DropDownComponent, DropdownItemComponent]
})
export class DropDownModule { }
