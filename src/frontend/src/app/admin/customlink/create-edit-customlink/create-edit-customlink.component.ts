import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from 'app/shared/message-handler/message-handler.service';
import { ActionType } from 'app/shared/shared.const';
import { CustomlinkService } from 'app/shared/client/v1/customlink.service';
import { Customlink } from 'app/shared/model/v1/customlink';
import { CacheService } from 'app/shared/auth/cache.service';
import { Namespace } from 'app/shared/model/v1/namespace';
import { RoadmapService } from 'app/shared/client/v1/roadmap.service';
import { PageState } from 'app/shared/page/page-state';
import { LinkType } from 'app/shared/model/v1/link-type';

@Component({
  selector: 'create-edit-customlink',
  templateUrl: 'create-edit-customlink.component.html',
  styleUrls: ['create-edit-customlink.component.scss']
})
export class CreateEditCustomlinkComponent implements OnInit {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm', { static: true })
  currentForm: NgForm;

  config: Customlink = new Customlink();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  params: string[] = [];
  linkTypes: LinkType[] = [];
  title: string;
  actionType: ActionType;
  namespaces: Namespace[];
  constructor(
    private configService: CustomlinkService,
    public cacheService: CacheService,
    private roadmapService: RoadmapService,
    private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit() {
    this.namespaces = this.cacheService.namespaces;
    this.roadmapService.list(new PageState({pageNo: 1, pageSize: 10000}))
    .subscribe(res => {
      this.linkTypes = res.data.list;
    });
  }

  typeChange() {
    this.params = [];
  }

  get paramsList(): string[] {
    const target = this.linkTypes.filter(item => {
      return item.typeName === this.config.linkType;
    })[0];
    if (target) {
      return target.paramList.split(',');
    }
    return [];
  }

  newOrEdit(id?: number) {
    this.modalOpened = true;
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑配置';
      this.configService.getById(id).subscribe(
        status => {
          this.config = status.data;
          this.params = status.data.params.split(',');
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建配置';
      this.config = new Customlink();
      this.params = [];
    }
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
    this.config.params = this.params.join(',');
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.configService.create({...this.config, addParam: this.config.params !== ''}).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建配置成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.configService.update({...this.config, addParam: this.config.params !== ''}).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新配置成功！');
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
      !this.checkOnGoing;
  }

}

