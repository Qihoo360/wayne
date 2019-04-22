import { NgModule } from '@angular/core';
import { CollapseComponent } from './collapse.component';
import { BoxModule } from '../box';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    BoxModule
  ],
  declarations: [
    CollapseComponent
  ],
  exports: [
    CollapseComponent
  ],
  providers: [
  ]
})
export class CollapseModule { }
