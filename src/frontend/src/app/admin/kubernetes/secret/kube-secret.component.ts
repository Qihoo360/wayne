import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { KubernetesClient } from '../../../shared/client/v1/kubernetes/kubernetes';
import { KubeResourceSecret } from '../../../shared/shared.const';
import { KubernetesNamespacedResource } from '../../../shared/base/kubernetes-namespaced/kubernetes-namespaced-resource';
import { DeletionDialogComponent } from '../../../shared/deletion-dialog/deletion-dialog.component';
import { MigrationComponent } from './migration/migration.component';
import { ListSecretComponent } from './list-secret/list-secret.component';

const showState = {
  'name': {hidden: false},
  'namespace': {hidden: false},
  'type': {hidden: false},
  'label': {hidden: false},
  'clusterIP': {hidden: false},
  'port': {hidden: false},
  'externalIP': {hidden: false},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-secret',
  templateUrl: './kube-secret.component.html'
})

export class KubeSecretComponent extends KubernetesNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListSecretComponent)
  listResourceComponent: ListSecretComponent;

  @ViewChild(AceEditorComponent)
  aceEditorModal: AceEditorComponent;

  @ViewChild(DeletionDialogComponent)
  deletionDialogComponent: DeletionDialogComponent;

  @ViewChild(MigrationComponent)
  migrationComponent: MigrationComponent;

  constructor(public kubernetesClient: KubernetesClient,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
    super(kubernetesClient, route, router, clusterService, authService, messageHandlerService);
    super.registResourceType('secret');
    super.registKubeResource(KubeResourceSecret);
    super.registShowSate(showState);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }


  migration(obj: any) {
    this.migrationComponent.openModal(this.cluster, obj);
  }

}
