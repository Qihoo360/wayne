import { NgModule } from '@angular/core';
import { CollapseComponent } from './collapse.component';
import { BoxComponent } from '../box/box.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    BoxComponent,
    CollapseComponent
  ],
  exports: [
    BoxComponent,
    CollapseComponent
  ],
  providers: [
  ]
})
export class CollapseModule { }
