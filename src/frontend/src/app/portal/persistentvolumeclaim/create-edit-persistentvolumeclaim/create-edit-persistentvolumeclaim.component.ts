import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType, configKeyApiNameGenerateRule} from '../../../shared/shared.const';
import {App} from '../../../shared/model/v1/app';
import {PersistentVolumeClaimService} from '../../../shared/client/v1/persistentvolumeclaim.service';
import {PersistentVolumeClaim} from '../../../shared/model/v1/persistentvolumeclaim';
import {AuthService} from '../../../shared/auth/auth.service';
import {ApiNameGenerateRule} from '../../../shared/utils';

@Component({
  selector: 'create-edit-persistentvolumeclaim',
  templateUrl: 'create-edit-persistentvolumeclaim.component.html',
  styleUrls: ['create-edit-persistentvolumeclaim.scss']
})
export class CreateEditPersistentVolumeClaimComponent implements OnInit {
  @Output() create = new EventEmitter<number>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  componentName = 'PVC';
  pvc: PersistentVolumeClaim = new PersistentVolumeClaim();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;

  title: string;
  actionType: ActionType;
  app: App;

  constructor(
    private pvcService: PersistentVolumeClaimService,
    private authService: AuthService,
    private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit(): void {
  }

  newOrEdit(app: App, id?: number) {
    this.modalOpened = true;
    this.app = app;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑' + this.componentName;
      this.pvcService.getById(id, this.app.id).subscribe(
        status => {
          this.pvc = status.data
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建' + this.componentName;
      this.pvc = new PersistentVolumeClaim();
    }
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  get nameGenerateRuleConfig():string{
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData)
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.pvc.appId = this.app.id;
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.pvc.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.pvc.name, this.app.name);
        this.pvcService.create(this.pvc).subscribe(
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
        this.pvcService.update(this.pvc).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(this.pvc.id);
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
    let cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid
    }
  }
}

