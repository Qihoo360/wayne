import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { Namespace } from '../../../shared/model/v1/namespace';
import { NamespaceService } from '../../../shared/client/v1/namespace.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';

@Component({
  selector: 'create-edit-app',
  templateUrl: 'create-edit-app.component.html',
  styleUrls: ['create-edit-app.scss']
})
export class CreateEditAppComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  createAppOpened: boolean;

  appForm: NgForm;
  @ViewChild('appForm', { static: true })
  currentForm: NgForm;

  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  componentName = '项目';
  app: App = new App();
  namespaces: Namespace[];
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  appTitle: string;
  actionType: ActionType;

  constructor(private appService: AppService,
              private namespaceService: NamespaceService,
              private aceEditorService: AceEditorService,
              private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit(): void {
    this.namespaceService.getNames().subscribe(
      response => {
        this.namespaces = response.data;
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  newOrEditApp(id?: number) {
    this.createAppOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.appTitle = '编辑' + this.componentName;
      this.appService.getById(id, 0).subscribe(
        status => {
          this.app = status.data;
          this.app.metaDataObj = JSON.parse(this.app.metaData ? this.app.metaData : '{}');
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.appTitle = '创建' + this.componentName;
      this.app = new App();
      this.app.metaDataObj = {};
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.app.metaDataObj));
  }

  onCancel() {
    this.createAppOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.app.metaData = this.aceBox.getValue();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.appService.create(this.app).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createAppOpened = false;
            this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createAppOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.appService.update(this.app).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createAppOpened = false;
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.createAppOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing;
  }

  handleValidation(): void {
    const cont = this.currentForm.controls['app_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

