import { NgModule } from '@angular/core';
import { FloatWindowComponent } from './float-window.component';
import { FloatWindowItemComponent } from './float-window-item/float-window-item.component';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [BrowserModule],
  declarations: [FloatWindowComponent, FloatWindowItemComponent],
  exports: [FloatWindowComponent, FloatWindowItemComponent]
})
export class FloatWindowModule { }
