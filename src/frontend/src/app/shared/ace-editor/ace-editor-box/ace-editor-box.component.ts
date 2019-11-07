import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AceEditorService } from '../ace-editor.service';
import { AceEditorMsg } from '../ace-editor';
import { Subscription } from 'rxjs/Subscription';
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/mode/yaml';
import * as YAML from 'js-yaml';
import { MessageHandlerService } from '../../message-handler/message-handler.service';

@Component({
  selector: 'wayne-ace-editor-box',
  templateUrl: './ace-editor-box.component.html',
  styleUrls: ['./ace-editor-box.component.scss']
})
export class AceEditorBoxComponent implements OnInit, OnDestroy {

  @ViewChild('editorElement', { static: false })
  editorElement: ElementRef;
  aceEditorMsg: AceEditorMsg;
  aceMode: string;
  editor: any;
  aceEditorMsgSub: Subscription;
  @Output() modalChange = new EventEmitter<any>();

  constructor(
    public el: ElementRef,
    private aceEditorService: AceEditorService,
    private messageHandle: MessageHandlerService) {
  }

  ngOnInit() {
    this.aceEditorMsgSub = this.aceEditorService.aceMessageAnnouncedSource$.subscribe(
      message => {
        const modalOpened = true;
        let title: string, hiddenFooter: boolean;
        this.aceMode = 'ace/mode/json';
        // 这里分为三种情况，不传edit时候是嵌套在其他模板中，true为编辑模板，false为查看模板。
        if (message.edit !== undefined) {
          if (message.edit) {
            title = '编辑模版';
            hiddenFooter = false;
          } else {
            title = '查看模版';
            hiddenFooter = true;
          }
          title = message.title ? message.title : title;
          const query = {modalOpened, title, hiddenFooter};
          // 这里通过判断observers.length来判断是否存在父组件，非官方方法；
          if (this.modalChange.observers.length) {
            this.modalChange.emit(query);
          }
        }
        this.aceEditorMsg = message;
        this.editor = ace.edit(this.editorElement.nativeElement);
        this.editor.getSession().setMode(this.aceMode);
        this.editor.$blockScrolling = Infinity;
        this.editor.setFontSize('16px');
        this.editor.setShowPrintMargin(false);
        this.editor.setValue(typeof this.aceEditorMsg.message === 'string' ?
          JSON.stringify(JSON.parse(this.aceEditorMsg.message), null, 2) : JSON.stringify(this.aceEditorMsg.message, null, 2));

        this.setStorageMode();
      }
    );
  }

  setValue(value: string) {
    this.aceMode = 'ace/mode/json';
    this.editor = ace.edit(this.editorElement.nativeElement);
    this.editor.getSession().setMode(this.aceMode);
    this.editor.$blockScrolling = Infinity;
    this.editor.setFontSize('16px');
    this.editor.setShowPrintMargin(false);
    this.editor.setValue(value, null, 2);

    this.setStorageMode();
  }

  setStorageMode() {
    const aceMode = localStorage.getItem('aceMode');
    if (aceMode && aceMode === 'ace/mode/yaml') {
      this.aceMode = aceMode;
      this.aceModeChange();
    }
  }

  ngOnDestroy() {
    if (this.aceEditorMsgSub) {
      this.aceEditorMsgSub.unsubscribe();
    }
  }

  aceModeChange() {
    this.editor.getSession().setMode(this.aceMode);
    if (this.editor.getValue().trim() !== '') {
      if (this.aceMode === 'ace/mode/json') {
        const obj = YAML.load(this.editor.getValue());
        this.editor.setValue(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(this.editor.getValue());
        this.editor.setValue(YAML.dump(obj));
      }
    }
    localStorage.setItem('aceMode', this.aceMode);
  }

  format() {
    try {
      if (this.aceMode === 'ace/mode/json') {
        const obj = JSON.parse(this.editor.getValue());
        this.editor.setValue(JSON.stringify(obj, null, 2));
      } else {
        const obj = YAML.load(this.editor.getValue());
        this.editor.setValue(YAML.dump(obj));
      }
    } catch (e) {
    }
  }

  getValue() {
    if (this.aceMode === 'ace/mode/json') {
      return this.editor.getValue();
    } else {
      return JSON.stringify(YAML.load(this.editor.getValue())) || '';
    }
  }

  clickEvent() {
    this.messageHandle.showError('请检查文本格式是否正确');
  }

  get isValid(): boolean {
    try {
      if (this.editor.getValue().trim() === '') {
        return true;
      }
      if (this.aceMode === 'ace/mode/json') {
        JSON.parse(this.editor.getValue());
      } else {
        YAML.load(this.editor.getValue());
      }
    } catch (e) {
      return false;
    }
    return true;
  }

}
