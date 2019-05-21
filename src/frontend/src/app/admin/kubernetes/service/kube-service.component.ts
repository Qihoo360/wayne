import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageHandlerService } from 'wayne-component';
import { ClusterService } from 'wayne-component/lib/client/v1/cluster.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { AceEditorComponent } from 'wayne-component/lib/ace-editor/ace-editor.component';
import { ListServiceComponent } from './list-service/list-service.component';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceService } from 'wayne-component/lib/shared.const';
import { KubernetesNamespacedResource } from 'wayne-component/lib/base/kubernetes-namespaced/kubernetes-namespaced-resource';
import { DeletionDialogComponent } from 'wayne-component/lib/deletion-dialog/deletion-dialog.component';
import { MigrationComponent } from './migration/migration.component';

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
  selector: 'wayne-kube-service',
  templateUrl: './kube-service.component.html'
})

export class KubeServiceComponent extends KubernetesNamespacedResource implements OnInit, OnDestroy {
  @ViewChild(ListServiceComponent)
  listResourceComponent: ListServiceComponent;

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
    super.registResourceType('service');
    super.registKubeResource(KubeResourceService);
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
