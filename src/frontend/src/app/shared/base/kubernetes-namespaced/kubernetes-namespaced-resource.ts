import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { AceEditorComponent } from '../../ace-editor/ace-editor.component';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClusterService } from '../../client/v1/cluster.service';
import { PageState } from '../../page/page-state';
import { ClrDatagridStateInterface } from '@clr/angular';
import { KubeResourceNamespace, KubeResourcesName } from '../../shared.const';
import { OnDestroy, OnInit } from '@angular/core';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';
import { DeletionDialogComponent } from '../../deletion-dialog/deletion-dialog.component';
import { DeleteEvent } from './kubernetes-list-resource';

export class KubernetesNamespacedResource implements OnInit, OnDestroy {
  aceEditorModal: AceEditorComponent;
  deletionDialogComponent: DeletionDialogComponent;

  showState: object;
  pageState: PageState = new PageState();

  cluster: string;
  clusters: Array<any>;
  resourceName: string;
  resources: Array<any>;
  showList: any[] = Array();

  resourceType: string;
  kubeResource: KubeResourcesName;

  namespaces = Array<string>();
  namespace = '';

  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
  }

  ngOnInit() {
    this.initShow();
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        this.clusters = data.map(item => item.name);
        this.cluster = data[0].name;
        this.jumpToHref(this.cluster);

      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  registKubeResource(kubeResource: string) {
    this.kubeResource = kubeResource;
  }

  registShowSate(state: Object) {
    this.showState = state;
  }

  onConfirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  onCancelEvent() {
    this.initShow();
  }

  createResource() {
    this.aceEditorModal.openModal({}, `创建 ${this.resourceType}`, true, true);
  }


  onDeleteResourceEvent(event: DeleteEvent) {
    let msg = `是否确认删除对象 ${event.obj.metadata.name}`;
    let title = `删除确认`;
    if (event.force === true) {
      msg = `是否确认强制删除对象 ${event.obj.metadata.name}, 强制删除将直接从 etcd 中删除数据，可能导致与 Kubernetes 中状态不一致!`;
      title = `强制删除确认`;
    }
    this.deletionDialogComponent.open(title, msg, event);
  }

  confirmDeleteEvent(event: DeleteEvent) {
    this.kubernetesClient
      .delete(this.cluster, this.kubeResource, event.force, event.obj.metadata.name, event.obj.metadata.namespace)
      .subscribe(
        response => {
          this.retrieveResource();
          this.messageHandlerService.showSuccess('ADMIN.KUBERNETES.MESSAGE.DELETE');
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
  }


  onEditResourceEvent(obj: any) {
    this.kubernetesClient.get(this.cluster, this.kubeResource, obj.metadata.name, obj.metadata.namespace)
      .subscribe(
        response => {
          const data = response.data;
          this.aceEditorModal.openModal(data, 'ADMIN.KUBERNETES.ACTION.EDIT', true);
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  onCreateResourceEvent(obj: any) {
    if (obj && obj.metadata && obj.metadata.namespace) {
      this.kubernetesClient.create(obj, this.cluster, this.kubeResource, obj.metadata.namespace).subscribe(
        resp2 => {
          this.messageHandlerService.showSuccess('ADMIN.KUBERNETES.MESSAGE.CREATE');
          this.retrieveResource();
        },
        error => {
          this.messageHandlerService.handleError(error);
        }
      );
    } else {
      this.messageHandlerService.showError('格式校验错误');
    }
  }

  onSaveResourceEvent(obj: any) {
    this.kubernetesClient.get(this.cluster, this.kubeResource, obj.metadata.name, obj.metadata.namespace).subscribe(
      resp => {
        const respObj = resp.data;
        respObj.spec = obj.spec;
        respObj.metadata.labels = obj.metadata.labels;
        respObj.metadata.annotations = obj.metadata.annotations;
        this.kubernetesClient.update(respObj, this.cluster, this.kubeResource, obj.metadata.name, obj.metadata.namespace).subscribe(
          resp2 => {
            this.messageHandlerService.showSuccess('ADMIN.KUBERNETES.MESSAGE.UPDATE');
            this.retrieveResource();
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  retrieveResource(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    if (this.cluster) {
      this.kubernetesClient.listPage(this.pageState, this.cluster, this.kubeResource, this.namespace)
        .subscribe(
          response => {
            const data = response.data;
            this.resources = data.list;
            this.pageState.page.totalPage = data.totalPage;
            this.pageState.page.totalCount = data.totalCount;
          },
          error => this.messageHandlerService.handleError(error)
        );
    }
  }

  jumpToHref(cluster: string) {
    this.cluster = cluster;
    this.kubernetesClient.getNames(this.cluster, KubeResourceNamespace).subscribe(
      resp => {
        this.namespace = '';
        this.namespaces = Array<string>();
        resp.data.map(ns => {
          this.namespaces.push(ns.name);
        });
        this.retrieveResource();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  ngOnDestroy(): void {
  }
}
