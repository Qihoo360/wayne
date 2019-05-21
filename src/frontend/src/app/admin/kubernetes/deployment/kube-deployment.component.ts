import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from 'wayne-component';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { AceEditorComponent } from 'wayne-component/lib/ace-editor/ace-editor.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceDeployment } from 'wayne-component/lib/shared.const';
import { KubernetesNamespacedResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-namespaced-resource';
import { DeletionDialogComponent } from 'wayne-component/lib/deletion-dialog/deletion-dialog.component';
import { MigrationComponent } from './migration/migration.component';
import { ListDeploymentComponent } from './list-deployment/list-deployment.component';

const showState = {
  'name': {hidden: false},
  'namespace': {hidden: false},
  'label': {hidden: false},
  'containers': {hidden: false},
  'status': {hidden: false},
  'age': {hidden: false},
};

@Component({
  selector: 'wayne-kube-deployment',
  templateUrl: './kube-deployment.component.html'
})

export class KubeDeploymentComponent extends KubernetesNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListDeploymentComponent)
  listResourceComponent: ListDeploymentComponent;

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
    super.registResourceType('deployment');
    super.registKubeResource(KubeResourceDeployment);
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
