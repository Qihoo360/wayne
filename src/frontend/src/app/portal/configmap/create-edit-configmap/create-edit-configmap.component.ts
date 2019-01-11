import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, configKeyApiNameGenerateRule } from '../../../shared/shared.const';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { App } from '../../../shared/model/v1/app';
import { ConfigMapService } from '../../../shared/client/v1/configmap.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ApiNameGenerateRule } from '../../../shared/utils';

@Component({
  selector: 'create-edit-configmap',
  templateUrl: 'create-edit-configmap.component.html',
  styleUrls: ['create-edit-configmap.scss']
})
export class CreateEditConfigMapComponent implements OnInit {
  @Output() create = new EventEmitter<number>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  componentName = '配置集';
  configMap: ConfigMap = new ConfigMap();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  title: string;
  actionType: ActionType;
  app: App;

  constructor(
    private configMapService: ConfigMapService,
    private authService: AuthService,
    private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit(): void {
  }

  newOrEditConfigMap(app: App, id?: number) {
    this.modalOpened = true;
    this.app = app;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑' + this.componentName;
      this.configMapService.getById(id, this.app.id).subscribe(
        status => {
          this.configMap = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建' + this.componentName;
      this.configMap = new ConfigMap();
    }
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  get nameGenerateRuleConfig(): string {
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData);
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.configMap.appId = this.app.id;
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.configMap.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.configMap.name, this.app.name);
        this.configMapService.create(this.configMap).subscribe(
          response => {
            this.isSubmitOnGoing = false;
            this.create.emit(response.data.id);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.configMapService.update(this.configMap).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(this.configMap.id);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新' + this.componentName + '成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
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

  //Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

