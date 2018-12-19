import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';

@Component({
  selector: 'create-edit-cluster',
  templateUrl: 'create-edit-cluster.component.html',
  styleUrls: ['create-edit-cluster.scss']
})
export class CreateEditClusterComponent {
  @Output() create = new EventEmitter<boolean>();
  modalOpened: boolean;
  @ViewChild('ngForm')
  currentForm: NgForm;

  @ViewChild('metaData')
  metaData: AceEditorBoxComponent;

  @ViewChild('kubeConfig')
  kubeConfig: AceEditorBoxComponent;
  cluster: Cluster = new Cluster();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;

  title: string;
  actionType: ActionType;

  clusterMeataObjExample = `{
  'rbd': {
    'monitors': [
      '10.10.10.10:6789'
    ],
    'fsType': 'xfs',
    'pool': 'k8s_pool',
    'user': 'search',
    'keyring': '/etc/ceph/ceph.client.keyring'
  },
  'cephfs': {
    'monitors': [
      '10.10.10.10'
    ],
    'user': 'cloud',
    'secret': 'secret'
  },
  'env': [
    {
      'name': 'IDC',
      'value': 'test'
    }
  ]
}`;

  constructor(private clusterService: ClusterService,
              private messageHandlerService: MessageHandlerService) {
  }

  newOrEditCluster(name?: string) {
    this.modalOpened = true;
    if (name) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑集群';
      this.clusterService.getByName(name).subscribe(
        status => {
          this.cluster = status.data;
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '关联集群';
      this.cluster = new Cluster();
      this.initJsonEditor();

    }
  }

  initJsonEditor() {
    this.metaData.setValue(this.cluster.metaData);
    this.kubeConfig.setValue(this.cluster.kubeConfig);
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

    if (!this.metaData.isValid || !this.kubeConfig.isValid) {
      alert('语法有误，请检查！');
      this.isSubmitOnGoing = false;
      return;
    }
    this.cluster.metaData = this.metaData.getValue();
    this.cluster.kubeConfig = this.kubeConfig.getValue();

    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.clusterService.create(this.cluster).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('创建集群成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.modalOpened = false;
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.clusterService.update(this.cluster).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.modalOpened = false;
            this.messageHandlerService.showSuccess('更新集群成功！');
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
    const cont = this.currentForm.controls['app_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }

  }

}

