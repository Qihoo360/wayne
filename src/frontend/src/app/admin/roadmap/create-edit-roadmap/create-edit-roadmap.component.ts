import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { RoadmapService } from '../../../shared/client/v1/roadmap.service';
import { LinkType } from '../../../shared/model/v1/link-type';

@Component({
  selector: 'create-edit-roadmap',
  templateUrl: './create-edit-roadmap.component.html',
  styleUrls: ['./create-edit-roadmap.component.scss']
})
export class CreateEditRoadmapComponent {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  config: LinkType = new LinkType();
  paramList: string[] = [];
  checkOnGoing = false;
  isSubmitOnGoing = false;

  title: string;
  actionType: ActionType;
  constructor(
    private configService: RoadmapService,
    private messageHandlerService: MessageHandlerService
  ) { }

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑配置';
      this.configService.getById(id).subscribe(
        status => {
          this.config = status.data;
          this.paramList = status.data.paramList.split(',');
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建配置';
      this.config = new LinkType();
      this.paramList = [];
    }
  }

  addParam() {
    this.paramList.push('');
  }

  deleteParam(i: number) {
    this.paramList.splice(i, 1);
  }

  trackByFn(index, item) {
    return index;
  }

  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.config.paramList = this.paramList.join(',');
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.configService.create(this.config).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建配置成功！');
            this.currentForm.reset();
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);
            this.currentForm.reset();
          }
        );
        break;
      case ActionType.EDIT:
        this.configService.update(this.config).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新配置成功！');
            this.currentForm.reset();
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);
            this.currentForm.reset();
          }
        );
        break;
    }
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing;
  }


}
