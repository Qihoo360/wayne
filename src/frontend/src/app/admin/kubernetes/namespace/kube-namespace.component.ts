import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { Node } from '../../../shared/model/v1/kubernetes/node-list';
import { NodeClient } from '../../../shared/client/v1/kubernetes/node';
import { KubeNode } from '../../../shared/model/v1/kubernetes/node';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';
import { ListNamespaceComponent } from './list-namespace/list-namespace.component';
import { NamespaceClient } from '../../../shared/client/v1/kubernetes/namespace';
import {PageState} from '../../../shared/page/page-state';

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

export class KubeNamespaceComponent implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceComponent)
  list: ListNamespaceComponent;

  @ViewChild(AceEditorComponent)
  editNodeModal: AceEditorComponent;
  showState: object = showState;

  cluster: string;
  clusters: Array<any>;
  namespace: string;
  namespaces: Array<any>;
  nodes: Node[];
  showList: any[] = new Array();

  subscription: Subscription;

  constructor(private nodeClient: NodeClient,
              private route: ActivatedRoute,
              private router: Router,
              private namespaceClient: NamespaceClient,
              private clusterService: ClusterService,
              private authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.NODE) {
        const name = message.data;
        this.nodeClient
          .deleteByName(name, this.cluster)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('节点删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
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

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  ngOnInit() {
    this.initShow();
    this.cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      response => {
        const data = response.data;
        this.clusters = data.map(item => item.name);
        if (data && data.length > 0 && !this.cluster) {
          this.router.navigateByUrl(`admin/kubernetes/namespace/${data[0].name}`);
          return;
        }
        if (this.cluster) {
          this.namespaceClient.list(this.cluster).subscribe(
            resp => {
              this.namespaces = resp.data;
              this.jumpTo(this.cluster);
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

  refresh(refresh: boolean) {
    if (refresh) {
      this.retrieve();
    }
  }

  retrieve(): void {
    if (this.cluster) {
      this.namespaceClient.list(this.cluster)
        .subscribe(
          response => {
            this.namespaces = response.data;
          },
          error => this.messageHandlerService.handleError(error)
        );
    }
  }


  editNode(node: Node) {
  }

  saveNode(editedNode: KubeNode) {

  }

  deleteNode(node: Node) {
  }

  jumpTo(cluster: string) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/namespace/${cluster}`);
    this.retrieve();
  }

}
