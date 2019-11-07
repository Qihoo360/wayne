import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceCustomResourceDefinition } from '../../../shared/shared.const';
import { DeletionDialogComponent } from '../../../shared/deletion-dialog/deletion-dialog.component';
import { KubernetesUnNamespacedResource } from '../../../shared/base/kubernetes-namespaced/kubernetes-unnamespaced-resource';
import { ListCrdComponent } from './list-crd/list-crd.component';

const showState = {
  'name': {hidden: false},
  'label': {hidden: true},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-crd',
  templateUrl: './kube-crd.component.html'
})

export class KubeCrdComponent extends KubernetesUnNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListCrdComponent, { static: false })
  listResourceComponent: ListCrdComponent;

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
    super.registResourceType('customresourcedefinition');
    super.registKubeResource(KubeResourceCustomResourceDefinition);
    super.registShowSate(showState);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
