import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'create-edit-app',
  templateUrl: 'create-edit-app.component.html',
  styleUrls: ['create-edit-app.scss']
})
export class CreateEditAppComponent {
  @Output() create = new EventEmitter<boolean>();
  createAppOpened: boolean;

  appForm: NgForm;
  @ViewChild('appForm', { static: true })
  currentForm: NgForm;

  app: App = new App();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  appTitle: string;
  actionType: ActionType;

  constructor(private appService: AppService,
              public cacheService: CacheService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
  }

  newOrEditApp(id?: number) {
    if (!this.cacheService.currentNamespace) {
      return;
    }
    const namespaceId = this.cacheService.namespaceId;
    this.createAppOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.appTitle = '编辑项目';
      this.appService.getById(id, namespaceId).subscribe(
        status => {
          this.app = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.appTitle = '创建项目';
      this.app = new App();
      this.app.namespace.id = this.cacheService.namespaceId;
    }
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
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.appService.create(this.app).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.createAppOpened = false;
            this.messageHandlerService.showSuccess('创建项目成功！');
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
            this.messageHandlerService.showSuccess('更新项目成功！');
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

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['app_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }

  }

}

