import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { ActionType, configKeyApiNameGenerateRule } from '../../../shared/shared.const';
import { App } from '../../../shared/model/v1/app';
import { Cluster } from '../../../shared/model/v1/cluster';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ApiNameGenerateRule } from '../../../shared/utils';

@Component({
  selector: 'create-edit-daemonset',
  templateUrl: 'create-edit-daemonset.component.html',
  styleUrls: ['create-edit-daemonset.scss']
})
export class CreateEditDaemonSetComponent implements OnInit {
  @Output() create = new EventEmitter<number>();
  modalOpened: boolean;

  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  daemonSet = new DaemonSet();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  title: string;
  actionType: ActionType;
  app: App;
  clusters = Array<Cluster>();

  constructor(private daemonSetService: DaemonSetService,
              private authService: AuthService,
              private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit(): void {

  }

  newOrEdit(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.clusters = Array<Cluster>();
    if (clusters && clusters.length > 0) {
      for (let c of clusters) {
        c.checked = false;
        this.clusters.push(c);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑守护进程集';
      this.daemonSetService.getById(id, this.app.id).subscribe(
        status => {
          let data = status.data;
          this.daemonSet = data;
          if (!data.metaData) {
            data.metaData = '{}';
          }
          let metaData = JSON.parse(data.metaData);
          if (metaData['clusters']) {
            for (let cluster of metaData['clusters']) {
              for (let i = 0; i < this.clusters.length; i++) {
                if (cluster == this.clusters[i].name) {
                  this.clusters[i].checked = true;
                }
              }
            }
          }
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建守护进程集';
      this.daemonSet = new DaemonSet();
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
    this.daemonSet.appId = this.app.id;
    if (!this.daemonSet.metaData) {
      this.daemonSet.metaData = '{}';
    }
    let metaData = JSON.parse(this.daemonSet.metaData);
    let checkedCluster = Array<string>();
    this.clusters.map(cluster => {
      if (cluster.checked) {
        checkedCluster.push(cluster.name);
      }
    });
    metaData['clusters'] = checkedCluster;
    this.daemonSet.metaData = JSON.stringify(metaData);
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.daemonSet.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.daemonSet.name, this.app.name);
        this.daemonSetService.create(this.daemonSet).subscribe(
          response => {
            this.isSubmitOnGoing = false;
            this.create.emit(response.data.id);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建守护进程集成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.daemonSetService.update(this.daemonSet).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(this.daemonSet.id);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新守护进程集成功！');
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
      this.isNameValid = cont.valid;
    }

  }

}

