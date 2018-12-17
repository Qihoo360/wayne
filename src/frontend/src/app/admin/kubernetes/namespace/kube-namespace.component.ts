import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { ListNamespaceComponent } from './list-namespace/list-namespace.component';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { KubernetesResource } from '../../../shared/base/kubernetes/kubernetes-resource';

const showState = {
  '名称': {hidden: false},
  '状态': {hidden: false},
  '创建时间': {hidden: false},
};

@Component({
  selector: 'wayne-kube-namespace',
  templateUrl: './kube-namespace.component.html',
  styleUrls: ['./kube-namespace.component.scss']
})

export class KubeNamespaceComponent extends KubernetesResource implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceComponent)
  listResourceComponent: ListNamespaceComponent;

  @ViewChild(AceEditorComponent)
  aceEditorModal: AceEditorComponent;

  constructor( public namespaceClient: NamespaceClient,
               public route: ActivatedRoute,
               public router: Router,
               public clusterService: ClusterService,
               public authService: AuthService,
               public messageHandlerService: MessageHandlerService,
               public deletionDialogService: ConfirmationDialogService) {
    super(namespaceClient, route, router, clusterService, authService, messageHandlerService, deletionDialogService);
    super.registResourceType('namespace');
    super.registShowSate(showState);
  }

  ngOnInit() {
    this.initShow();
    this.cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        this.clusters = data.map(item => item.name);
        if (data && data.length > 0 && !this.cluster) {
          this.jumpToHref(data[0].name);
          return;
        }
        if (this.cluster) {
          this.namespaceClient.list(this.cluster).subscribe(
            resp => {
              this.resources = resp.data;
              this.jumpToHref(this.cluster);
            },
            error => this.messageHandlerService.handleError(error)
          );
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  ngOnDestroy(): void {
  }

}
