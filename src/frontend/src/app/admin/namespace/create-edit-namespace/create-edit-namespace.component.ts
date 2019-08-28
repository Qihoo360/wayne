import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { ClusterMeta, Namespace } from '../../../shared/model/v1/namespace';
import { NamespaceService } from '../../../shared/client/v1/namespace.service';
import { Cluster } from '../../../shared/model/v1/cluster';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { AceEditorBoxComponent } from '../../../shared/ace-editor/ace-editor-box/ace-editor-box.component';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

class Annotation {
  key: string;
  value: string;
}
@Component({
  selector: 'create-edit-namespace',
  templateUrl: 'create-edit-namespace.component.html',
  styleUrls: ['create-edit-namespace.scss']
})
export class CreateEditNamespaceComponent {
  @Output() create = new EventEmitter<boolean>();
  opened: boolean;
  showACE: boolean;
  defaultMetaData = `{
  "imagePullSecrets": [],
  "env":[],
  "clusterMeta": {
  },
  "ingressAnnotations": {
  },
  "namespace": ""
}`;
  @ViewChild(AceEditorBoxComponent, { static: false })
  aceBox: any;

  namespaceForm: NgForm;
  @ViewChild('namespaceForm', { static: true })
  currentForm: NgForm;
  ns: Namespace = new Namespace();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  isNameValid = true;
  autoCreate = false;
  nsTitle: string;
  actionType: ActionType;

  clusters: Cluster[];
  clusterMetas: {};

  ingressAnnotations: Annotation[] = [];
  ingressMetas: {};

  serviceAnnotations: Annotation[] = [];
  serviceMetas: {};

  constructor(
    private namespaceClient: NamespaceClient,
    private namespaceService: NamespaceService,
    private messageHandlerService: MessageHandlerService,
    private aceEditorService: AceEditorService) {
  }

  newOrEditNamespace(clusters: Cluster[], id?: number) {
    this.opened = true;

    this.clusterMetas = {};
    this.clusters = clusters;
    if (this.clusters && this.clusters.length > 0) {
      for (const clu of this.clusters) {
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
          this.setIngressMetas();
          this.setServiceMetas();
          this.initJsonEditor();
        },
        error => {
          this.messageHandlerService.handleError(error);

        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.nsTitle = '创建命名空间';
      this.ns = new Namespace();
      this.ns.metaDataObj = JSON.parse(this.defaultMetaData);
      this.ingressAnnotations = [];
      this.serviceAnnotations = [];
      this.initJsonEditor();
    }
  }

  initJsonEditor(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.ns.metaDataObj));
  }

  onEditMetadata() {
    this.showACE = !this.showACE;
    if (!this.showACE) {
      this.ns.metaDataObj = JSON.parse(this.aceBox.getValue());
      this.setClusterMetas();
      this.setIngressMetas();
      this.setServiceMetas();
    } else {
      this.buildMetaDataObj();
      this.initJsonEditor();
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

  onAddIngressAnnotations() {
    if (!this.ns.metaDataObj.ingressAnnotations) {
      this.ns.metaDataObj.ingressAnnotations = {};
    }
    this.ingressAnnotations.push({'key': '', 'value': ''});
  }

  onDeleteIngressAnnotations(i: number) {
    this.ingressAnnotations.splice(i, 1);
  }

  onAddServiceAnnotations() {
    if (!this.ns.metaDataObj.serviceAnnotations) {
      this.ns.metaDataObj.serviceAnnotations = {};
    }
    this.serviceAnnotations.push({'key': '', 'value': ''});
  }

  onDeleteServiceAnnotations(i: number) {
    this.serviceAnnotations.splice(i, 1);
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
        const clusterMeta = this.clusterMetas[cluster];
        const clusterMetaData = this.ns.metaDataObj.clusterMeta[cluster];
        if (clusterMeta) {
          clusterMeta.checked = true;
          clusterMeta.cpu = clusterMetaData.resourcesLimit.cpu;
          clusterMeta.memory = clusterMetaData.resourcesLimit.memory;
        }
        this.clusterMetas[cluster] = clusterMeta;
      });
    }
  }

  setIngressMetas() {
    if (this.ns && this.ns.metaDataObj && this.ns.metaDataObj.ingressAnnotations) {
      this.ingressAnnotations = [];
      Object.getOwnPropertyNames(this.ns.metaDataObj.ingressAnnotations).map(key => {
          this.ingressAnnotations.push({'key': key, 'value': this.ns.metaDataObj.ingressAnnotations[key]});
      });
    }
  }

  setServiceMetas() {
    if (this.ns && this.ns.metaDataObj && this.ns.metaDataObj.serviceAnnotations) {
      this.serviceAnnotations = [];
      Object.getOwnPropertyNames(this.ns.metaDataObj.serviceAnnotations).map(key => {
        this.serviceAnnotations.push({'key': key, 'value': this.ns.metaDataObj.serviceAnnotations[key]});
      });
    }
  }

  buildMetaDataObj() {
    if (this.clusterMetas) {
      Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
        const clusterMeta = this.clusterMetas[cluster];
        if (clusterMeta && clusterMeta.checked) {
          const clusterMetaData = new ClusterMeta();
          clusterMetaData.resourcesLimit.cpu = clusterMeta.cpu;
          clusterMetaData.resourcesLimit.memory = clusterMeta.memory;
          this.ns.metaDataObj.clusterMeta[cluster] = clusterMetaData;
        } else {
          this.ns.metaDataObj.clusterMeta[cluster] = undefined;
        }
      });
    }
    if (this.ingressAnnotations) {
      this.ns.metaDataObj.ingressAnnotations = {};
      for (const a of this.ingressAnnotations) {
        if (a.key !== '') {
          this.ns.metaDataObj.ingressAnnotations[a.key] = a.value;
        }
      }
    }
    if (this.serviceAnnotations) {
      this.ns.metaDataObj.serviceAnnotations = {};
      for (const a of this.serviceAnnotations) {
        if (a.key !== '') {
          this.ns.metaDataObj.serviceAnnotations[a.key] = a.value;
        }
      }
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
    if (this.showACE) {
      this.ns.metaDataObj = JSON.parse(this.aceBox.getValue());
    }
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
            if (this.autoCreate && this.clusterMetas) {
              Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
                const clusterMeta = this.clusterMetas[cluster];
                if (clusterMeta && clusterMeta.checked) {
                  this.namespaceClient.create(this.ns.kubeNamespace, cluster).subscribe(
                    next => {
                      if (next.data == null) {
                        this.messageHandlerService.showSuccess(`集群 ${cluster} 已存在对应的 kubernetes namespace！`);
                      } else {
                        this.messageHandlerService.showSuccess(`集群 ${cluster} 创建 kubernetes namespace 成功！`);
                      }
                    },
                    error => {
                      this.messageHandlerService.handleError(error);
                    }
                  );
                }
              });
            }
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
            if (this.autoCreate && this.clusterMetas) {
              Object.getOwnPropertyNames(this.clusterMetas).map(cluster => {
                const clusterMeta = this.clusterMetas[cluster];
                if (clusterMeta && clusterMeta.checked) {
                  this.namespaceClient.create(this.ns.kubeNamespace, cluster).subscribe(
                    next => {
                      if (next.data == null) {
                        this.messageHandlerService.showSuccess(`集群 ${cluster} 已存在对应的 kubernetes namespace！`);
                      } else {
                          this.messageHandlerService.showSuccess(`集群 ${cluster} 创建 kubernetes namespace 成功！`);
                      }
                    },
                    error => {
                      this.messageHandlerService.handleError(error);
                    }
                  );
                }
              });
            }
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
    const cont = this.currentForm.controls['ns_name'];
    if (cont) {
      this.isNameValid = cont.valid;
    }
  }
}

