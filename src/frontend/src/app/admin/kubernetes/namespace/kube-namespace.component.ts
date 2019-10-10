import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceNamespace } from '../../../shared/shared.const';
import { DeletionDialogComponent } from '../../../shared/deletion-dialog/deletion-dialog.component';
import { KubernetesUnNamespacedResource } from '../../../shared/base/kubernetes-namespaced/kubernetes-unnamespaced-resource';
import { ListNamespaceComponent } from './list-namespace/list-namespace.component';

const showState = {
  'name': {hidden: false},
  'label': {hidden: false},
  'status': {hidden: false},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-namespace',
  templateUrl: './kube-namespace.component.html'
})

export class KubeNamespaceComponent extends KubernetesUnNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceComponent, { static: false })
  listResourceComponent: ListNamespaceComponent;

  @ViewChild(AceEditorComponent, { static: false })
  aceEditorModal: AceEditorComponent;

  @ViewChild(DeletionDialogComponent, { static: false })
  deletionDialogComponent: DeletionDialogComponent;

  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, route, router, clusterService, authService, messageHandlerService);
    super.registResourceType('namespace');
    super.registKubeResource(KubeResourceNamespace);
    super.registShowSate(showState);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
