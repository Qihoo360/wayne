import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from '@clr/angular';
import { Subscription } from 'rxjs/Subscription';
import { DeploymentClient } from '../../../shared/client/v1/kubernetes/deployment';
import { PageState } from '../../../shared/page/page-state';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { KubeListDeploymentComponent } from './list/kube-list-deployment.component';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { DeploymentList } from '../../../shared/model/v1/deployment-list';
import { AdminDefaultApiId } from '../../../shared/shared.const';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { KubeMigrationDeploymentComponent } from './migration/kube-migration-deployment.component';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { KubeDeployment } from '../../../shared/model/v1/kubernetes/deployment';

const showState = {
  'name': {hidden: false},
  'label': {hidden: false},
  'containers': {hidden: false},
  'status': {hidden: false},
  'age': {hidden: false}
};

@Component({
  selector: 'kubernetes-deployment',
  templateUrl: './kube-deployment.component.html'
})
export class KubeDeploymentComponent implements OnInit {
  @ViewChild(KubeListDeploymentComponent)
  listDeployment: KubeListDeploymentComponent;
  @ViewChild(KubeMigrationDeploymentComponent)
  migrationDeployment: KubeMigrationDeploymentComponent;
  @ViewChild(AceEditorComponent)
  editModal: AceEditorComponent;

  namespace: string;
  cluster: string;
  clusters: Array<any>;
  changedDeployments: DeploymentList[];
  pageState: PageState = new PageState();
  subscription: Subscription;

  showList: any[] = Array();
  showState: object = showState;

  namespaces: string[];

  constructor(private breadcrumbService: BreadcrumbService,
              private deploymentClient: DeploymentClient,
              private clusterService: ClusterService,
              private namespaceClient: NamespaceClient,
              private route: ActivatedRoute,
              private router: Router,
              private aceEditorService: AceEditorService,
              private messageHandlerService: MessageHandlerService) {
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  confirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  cancelEvent() {
    this.initShow();
  }

  ngOnInit() {
    this.initShow();
    const cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        this.clusters = data.map(item => item.name);
        if (data && data.length > 0 && !cluster) {
          this.router.navigateByUrl(`admin/kubernetes/deployment/${data[0].name}`);
          return;
        }
        if (cluster) {
          this.jumpTo(cluster);
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  jumpTo(cluster: string) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/deployment/${cluster}`);
    this.namespaceClient.getNames(cluster).subscribe(
      resp => {
        this.namespaces = resp.data;
        this.namespace = this.namespaces && this.namespaces.length > 0 ? this.namespaces[0] : 'default';
        this.retrieve();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  detail(deploymentList: DeploymentList) {
    this.deploymentClient.get(AdminDefaultApiId, this.cluster, deploymentList.objectMeta.namespace, deploymentList.objectMeta.name)
      .subscribe(
        response => {
          const data = response.data;
          this.editModal.openModal(data, '编辑节点', true);
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  migration(deploymentList: DeploymentList) {
    this.deploymentClient.get(AdminDefaultApiId, this.cluster, deploymentList.objectMeta.namespace, deploymentList.objectMeta.name)
      .subscribe(
        response => {
          const data = response.data;
          this.migrationDeployment.openModal(this.cluster, data);
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  save(obj: KubeDeployment) {
    this.deploymentClient.update(AdminDefaultApiId, this.cluster, obj.metadata.namespace, obj.metadata.name, obj).subscribe(
      resp => {
        this.messageHandlerService.showSuccess('更新成功！');
        this.retrieve();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    if (this.cluster) {
      this.deploymentClient.listPage(this.pageState, this.cluster, this.namespace)
        .subscribe(
          response => {
            const data = response.data;
            this.pageState.page.totalPage = data.totalPage;
            this.pageState.page.totalCount = data.totalCount;
            this.changedDeployments = data.list;
          },
          error => this.messageHandlerService.handleError(error)
        );
    }
  }

}
