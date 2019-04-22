import { NgModule } from '@angular/core';
import { AceEditorComponent } from './ace-editor.component';
import { AceEditorBoxComponent } from './ace-editor-box/ace-editor-box.component';
import { ClarityModule } from '@clr/angular';
import { AceEditorService } from './ace-editor.service';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ModalOperateModule } from '../modal-operate/index';

@NgModule({
  imports: [ClarityModule, BrowserModule, TranslateModule, FormsModule, ModalOperateModule],
  declarations: [AceEditorComponent, AceEditorBoxComponent],
  exports: [AceEditorComponent, AceEditorBoxComponent],
  providers: [
    AceEditorService
  ]
})
export class AceEditorModule { }
