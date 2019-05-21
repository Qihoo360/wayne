import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from 'wayne-component';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { AceEditorComponent } from 'wayne-component/lib/ace-editor/ace-editor.component';
import { ListPodComponent } from './list-pod/list-pod.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourcePod } from 'wayne-component/lib/shared.const';
import { KubernetesNamespacedResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-namespaced-resource';
import { DeletionDialogComponent } from 'wayne-component/lib/deletion-dialog/deletion-dialog.component';

const showState = {
  'name': {hidden: false},
  'namespace': {hidden: false},
  'label': {hidden: false},
  'images': {hidden: true},
  'status': {hidden: false},
  'podIP': {hidden: false},
  'node': {hidden: false},
  'restartCount': {hidden: false},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-pod',
  templateUrl: './kube-pod.component.html'
})

export class KubePodComponent extends KubernetesNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListPodComponent)
  listResourceComponent: ListPodComponent;

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
    super.registResourceType('pod');
    super.registKubeResource(KubeResourcePod);
    super.registShowSate(showState);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }




}
