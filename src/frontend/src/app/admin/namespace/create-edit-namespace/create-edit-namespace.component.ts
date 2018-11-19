import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType} from '../../../shared/shared.const';
import {ClusterMeta, Namespace} from '../../../shared/model/v1/namespace';
import {NamespaceService} from '../../../shared/client/v1/namespace.service';
import {Cluster} from '../../../shared/model/v1/cluster';

@Component({
  selector: 'create-edit-namespace',
  templateUrl: 'create-edit-namespace.component.html',
  styleUrls: ['create-edit-namespace.scss']
})
export class CreateEditNamespaceComponent {
  @Output() create = new EventEmitter<boolean>();
  opened: boolean;
  defaultMetaData = `{
  "imagePullSecrets": [],
  "env":[],
  "clusterMeta": {
  },
  "namespace": ""
}`;
  namespaceForm: NgForm;
  @ViewChild('namespaceForm')
  currentForm: NgForm;
  ns: Namespace = new Namespace();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  nsTitle: string;
  actionType: ActionType;

  clusters: Cluster[];
  clusterMetas: {};


  constructor(
    private namespaceService: NamespaceService,
    private messageHandlerService: MessageHandlerService) {
  }

  newOrEditNamespace(clusters: Cluster[], id?: number) {
    this.opened = true;

    this.clusterMetas = {};
    this.clusters = clusters;
    if (this.clusters && this.clusters.length > 0) {
      for (let clu of this.clusters) {
        this.clusterMetas[clu.name] = {'checked': false, 'cpu': null, 'memory': null};
      }
    }

    if (id) {
      this.actionType = ActionType.EDIT;
      this.nsTitle = '编辑命名空间';
      this.namespaceService.getNamespace(id).subscribe(
        status => {
          this.ns = status.data;
          if (this.ns.metaData !== '') {
            this.ns.metaDataObj = Namespace.ParseNamespaceMetaData(this.ns.metaData);
          }
          this.setClusterMetas();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.nsTitle = '创建命名空间';
      this.ns = new Namespace();
      this.ns.metaDataObj = JSON.parse(this.defaultMetaData);
    }

  }

  onAddEnv() {
    if (!this.ns.metaDataObj.env) {
      this.ns.metaDataObj.env = [];
    }
    this.ns.metaDataObj.env.push({'name': '', 'value': ''});
  }

  onDeleteEnv(i: number) {
    this.ns.metaDataObj.env.splice(i, 1);
  }

  onAddSecret() {
    if (!this.ns.metaDataObj.imagePullSecrets) {
      this.ns.metaDataObj.imagePullSecrets = [];
    }
    this.ns.metaDataObj.imagePullSecrets.push({'name': ''});
  }

  onDeleteSecret(i: number) {
    this.ns.metaDataObj.imagePullSecrets.splice(i, 1);
  }

  setClusterMetas() {
    if (this.ns && this.ns.metaDataObj && this.ns.metaDataObj.clusterMeta) {
      Object.getOwnPropertyNames(this.ns.metaDataObj.clusterMeta).map(cluster => {
        let clusterMeta = this.clusterMetas[cluster];
        let clusterMetaData = this.ns.metaDataObj.clusterMeta[cluster];
        if (clusterMeta) {
          clusterMeta.checked = true;
          clusterMeta.cpu = clusterMetaData.resourcesLimit.cpu;
          clusterMeta.memory = clusterMetaData.resourcesLimit.memory;
        }
        this.clusterMetas[cluster] = clusterMeta;
      })
    }
  }

  buildMetaDataObj() {
    if (this.clusterMetas) {
      Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
        let clusterMeta = this.clusterMetas[cluster];
        if (clusterMeta && clusterMeta.checked) {
          let clusterMetaData = new ClusterMeta();
          clusterMetaData.resourcesLimit.cpu = clusterMeta.cpu;
          clusterMetaData.resourcesLimit.memory = clusterMeta.memory;
          this.ns.metaDataObj.clusterMeta[cluster] = clusterMetaData;
        } else {
          this.ns.metaDataObj.clusterMeta[cluster] = undefined;
        }
      })
    }
  }

  onCancel() {
    this.opened = false;
    this.currentForm.reset();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.buildMetaDataObj();
    this.ns.metaData = JSON.stringify(this.ns.metaDataObj);
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.namespaceService.createNamespace(this.ns).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.opened = false;
            this.messageHandlerService.showSuccess('创建命名空间成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.opened = false;
            this.messageHandlerService.handleError(error);
          }
        );
        break;
      case ActionType.EDIT:
        this.namespaceService.updateNamespace(this.ns).subscribe(
          status => {
            this.isSubmitOnGoing = false;
            this.create.emit(true);
            this.opened = false;
            this.messageHandlerService.showSuccess('更新命名空间成功！');
          },
          error => {
            this.isSubmitOnGoing = false;
            this.opened = false;
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
    let cont = this.currentForm.controls['ns_name'];
    if (cont) {
      this.isNameValid = cont.valid
    }
  }
}

