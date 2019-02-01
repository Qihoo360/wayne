import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { ListPodComponent } from './list-pod/list-pod.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourcePod } from '../../../shared/shared.const';
import { KubernetesNamespacedResource } from '../../../shared/base/kubernetes-namespaced/kubernetes-namespaced-resource';

const showState = {
  'name': {hidden: false},
  'label': {hidden: false},
  'images': {hidden: false},
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


  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService) {
    super(kubernetesClient, route, router, clusterService, authService, messageHandlerService, deletionDialogService);
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
