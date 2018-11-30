import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AceEditorBoxComponent } from './ace-editor-box/ace-editor-box.component';
import { ModalInfo } from './modalInfo';
import * as YAML from 'js-yaml';

@Component({
  selector: 'wayne-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements OnInit {

  modalOpened: boolean;
  title: string;
  hiddenFooter: boolean;
  @ViewChild(AceEditorBoxComponent) box: AceEditorBoxComponent;

  @Output() outputObj = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.modalOpened = false;
  }

  openModal(value: any, title: string, edit: boolean) {
    this.hiddenFooter = !edit;
    this.title = title;
    this.modalOpened = true;
    this.box.setValue(typeof value === 'string' ? JSON.stringify(JSON.parse(value), null, 2) : JSON.stringify(value, null, 2));
  }

  modalInfo(info: ModalInfo) {
    Object.getOwnPropertyNames(info).map(key => {
      if (info[key]) this[key] = info[key];
    });
  }

  onSubmit() {
    if (this.box.aceMode == 'ace/mode/json') {
      this.outputObj.emit(JSON.parse(this.box.editor.getValue()));
    } else {
      this.outputObj.emit(YAML.load(this.box.editor.getValue()));
    }
    this.modalOpened = false;
  }

  get isValid(): boolean {
    try {
      if (this.box.aceMode == 'ace/mode/json') {
        JSON.parse(this.box.editor.getValue());
      } else {
        YAML.load(this.box.editor.getValue());
      }
    } catch (e) {
      return false;
    }
    return true;
  }
}
