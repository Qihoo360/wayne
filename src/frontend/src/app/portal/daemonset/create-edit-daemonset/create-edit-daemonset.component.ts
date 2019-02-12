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
import { TranslateService } from '@ngx-translate/core';
import { ResourceLimitComponent } from '../../../shared/component/resource-limit/resource-limit.component';
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
  @ViewChild(ResourceLimitComponent)
  resourceLimitComponent: ResourceLimitComponent;

  daemonSet = new DaemonSet();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;
  title: string;
  actionType: ActionType;
  app: App;
  clusters = Array<Cluster>();

  constructor(private daemonSetService: DaemonSetService,
              public authService: AuthService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit(): void {

  }

  newOrEdit(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.clusters = Array<Cluster>();
    if (clusters && clusters.length > 0) {
      for (const c of clusters) {
        c.checked = false;
        this.clusters.push(c);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = 'DAEMONSET.EDIT';
      this.daemonSetService.getById(id, this.app.id).subscribe(
        status => {
          const data = status.data;
          this.daemonSet = data;
          if (!data.metaData) {
            data.metaData = '{}';
          }
          const metaData = JSON.parse(data.metaData);
          if (metaData['clusters']) {
            for (const cluster of metaData['clusters']) {
              for (let i = 0; i < this.clusters.length; i++) {
                if (cluster === this.clusters[i].name) {
                  this.clusters[i].checked = true;
                }
              }
            }
          }
          this.resourceLimitComponent.setValue(metaData.resources);
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = 'DAEMONSET.CREATE';
      this.daemonSet = new DaemonSet();
      this.resourceLimitComponent.setValue();
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
    const metaData = JSON.parse(this.daemonSet.metaData);
    const checkedCluster = Array<string>();
    this.clusters.map(cluster => {
      if (cluster.checked) {
        checkedCluster.push(cluster.name);
      }
    });
    metaData['clusters'] = checkedCluster;
    metaData['resources'] = this.resourceLimitComponent.getValue();
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

  // Handle the form validation
  handleValidation(): void {
    const cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }

  }

}

