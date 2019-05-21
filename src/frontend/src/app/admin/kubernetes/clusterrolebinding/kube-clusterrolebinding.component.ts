import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from 'wayne-component';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { AceEditorComponent } from 'wayne-component/lib/ace-editor/ace-editor.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceClusterRoleBinding } from 'wayne-component/lib/shared.const';
import { DeletionDialogComponent } from 'wayne-component/lib/deletion-dialog/deletion-dialog.component';
import { KubernetesUnNamespacedResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-unnamespaced-resource';
import { ListClusterrolebindingComponent } from './list-clusterrolebinding/list-clusterrolebinding.component';

const showState = {
  'name': {hidden: false},
  'label': {hidden: false},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-clusterrolebinding',
  templateUrl: './kube-clusterrolebinding.component.html'
})

export class KubeClusterrolebindingComponent extends KubernetesUnNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListClusterrolebindingComponent)
  listResourceComponent: ListClusterrolebindingComponent;

  @ViewChild(AceEditorComponent)
  aceEditorModal: AceEditorComponent;

  @ViewChild(DeletionDialogComponent)
  deletionDialogComponent: DeletionDialogComponent;

  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, route, router, clusterService, authService, messageHandlerService);
    super.registResourceType('clusterrolebinding');
    super.registKubeResource(KubeResourceClusterRoleBinding);
    super.registShowSate(showState);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
