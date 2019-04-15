import { NgModule } from '@angular/core';
import { DiffComponent } from './diff.component';
import { DiffService } from './diff.service';
import { FormsModule } from '@angular/forms';
import { ModalOperateModule } from '../modal-operate/index';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [BrowserModule, FormsModule, ModalOperateModule, ClarityModule],
  declarations: [DiffComponent],
  exports: [DiffComponent],
  providers: [DiffService]
})
export class DiffModule { }
