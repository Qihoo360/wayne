import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { AceEditorComponent } from '../../ace-editor/ace-editor.component';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClusterService } from '../../client/v1/cluster.service';
import { PageState } from '../../page/page-state';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationButtons, ConfirmationState, KubeResourceNamespace, KubeResourcePod, KubeResourcesName } from '../../shared.const';
import { OnDestroy, OnInit } from '@angular/core';
import { KubernetesClient } from '../../client/v1/kubernetes/kubernetes';
import { ConfirmationMessage } from '../../confirmation-dialog/confirmation-message';

export class KubernetesNamespacedResource implements OnInit, OnDestroy {
  aceEditorModal: AceEditorComponent;

  showState: object;
  pageState: PageState = new PageState();

  cluster: string;
  clusters: Array<any>;
  resourceName: string;
  resources: Array<any>;
  showList: any[] = Array();

  subscription: Subscription;
  resourceType: string;
  kubeResource: KubeResourcesName;


  namespaces: string[];
  namespace: string;

  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === this.kubeResource) {
        const obj: any = message.data;
        this.kubernetesClient
          .delete(this.cluster, this.kubeResource, obj.metadata.name, obj.metadata.namespace)
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
    });
  }

  ngOnInit() {
    this.initShow();
    const cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        this.clusters = data.map(item => item.name);
        if (data && data.length > 0 && !cluster) {
          this.router.navigateByUrl(`admin/kubernetes/${this.resourceType}/${data[0].name}`);
          return;
        }
        if (cluster) {
          this.jumpToHref(cluster);
        }
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
    this.aceEditorModal.openModal({}, 'ADMIN.KUBERNETES.POD.CREATE', true, true);
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
      this.kubernetesClient.listPage(this.pageState, this.cluster, KubeResourcePod, this.namespace)
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

  onDeleteResourceEvent(resource: any) {
    const deletionMessage = new ConfirmationMessage(
      '删除确认',
      `是否确认删除对象 ${resource.metadata.name}`,
      resource,
      this.kubeResource,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  jumpToHref(cluster) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/${this.resourceType}/${cluster}`);
    this.kubernetesClient.getNames(cluster, KubeResourceNamespace).subscribe(
      resp => {
        this.namespaces = Array<string>();
        const namespaces: Array<any> = resp.data;
        namespaces.map(ns => {
          this.namespaces.push(ns.name);
        });
        this.namespace = this.namespaces && this.namespaces.length > 0 ? this.namespaces[0] : 'default';
        // this.retrieveResource();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
