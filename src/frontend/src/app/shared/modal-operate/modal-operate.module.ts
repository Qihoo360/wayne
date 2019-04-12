import { NgModule } from '@angular/core';
import { ModalOperateComponent } from './modal-operate.component';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [ClarityModule, BrowserModule],
  declarations: [ModalOperateComponent],
  exports: [ModalOperateComponent]
})
export class ModalOperateModule { }
