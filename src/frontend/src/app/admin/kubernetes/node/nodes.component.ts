import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ListNodesComponent } from './list-nodes/list-nodes.component';
import { Node } from '../../../shared/model/v1/kubernetes/node-list';
import { NodeClient } from '../../../shared/client/v1/kubernetes/node';
import { Inventory } from './list-nodes/inventory';
import { KubeNode } from '../../../shared/model/v1/kubernetes/node';
import { AceEditorComponent } from '../../../shared/ace-editor/ace-editor.component';

const showState = {
  'name': {hidden: false},
  '标签': {hidden: false},
  'Taints': {hidden: true},
  'Ready': {hidden: false},
  '可调度': {hidden: false},
  'CPU(Core)': {hidden: false},
  'Memory(G)': {hidden: false},
  'Kubelet版本': {hidden: true},
  'Age': {hidden: false},
  'kubeProxy版本': {hidden: true},
  '系统版本': {hidden: true},
  '内核版本': {hidden: true},
  'CRI版本': {hidden: true}
};

@Component({
  selector: 'wayne-nodes',
  providers: [Inventory],
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})

export class NodesComponent implements OnInit, OnDestroy {
  @ViewChild(ListNodesComponent)
  list: ListNodesComponent;

  @ViewChild(AceEditorComponent)
  editNodeModal: AceEditorComponent;
  showState: object = showState;

  cluster: string;
  clusters: Array<any>;
  nodes: Node[];
  showList: any[] = new Array();

  subscription: Subscription;

  constructor(private nodeClient: NodeClient,
              private route: ActivatedRoute,
              private inventory: Inventory,
              private router: Router,
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
    let cluster = this.route.snapshot.params['cluster'];
    this.clusterService.getNames().subscribe(
      resp => {
        const data = resp.data;
        if (data) {
          this.clusters = data.map(item => item.name);
          if (data.length > 0 && !this.cluster || this.clusters.indexOf(this.cluster) === -1) {
            cluster = cluster ? cluster : data[0].name;
          }
          this.jumpTo(cluster);
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh(refresh: boolean) {
    if (refresh) {
      this.retrieve();
    }
  }

  retrieve(): void {
    if (!this.cluster) {
      return;
    }

    this.nodeClient.list(this.cluster).subscribe(
      response => {
        const nodes = response.data;
        this.inventory.size = nodes.length;
        this.inventory.reset(nodes);
        this.nodes = this.inventory.all;
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }


  editNode(node: Node) {
    this.nodeClient.getByName(node.name, this.cluster).subscribe(
      resp => {
        const data = resp.data;
        this.editNodeModal.openModal(data, '编辑节点', true);
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  saveNode(editedNode: KubeNode) {
    this.nodeClient.getByName(editedNode.metadata.name, this.cluster).subscribe(
      resp => {
        const node: KubeNode = resp.data;
        node.spec = editedNode.spec;
        node.metadata.labels = editedNode.metadata.labels;
        node.metadata.annotations = editedNode.metadata.annotations;
        this.nodeClient.update(node, this.cluster).subscribe(
          resp2 => {
            this.messageHandlerService.showSuccess('节点更新成功！');
            this.retrieve();
          },
          error => {
            this.messageHandlerService.handleError(error);
          }
        );
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );

  }

  deleteNode(node: Node) {
    const deletionMessage = new ConfirmationMessage(
      '删除节点确认',
      '你确认删除节点 ' + node.name + ' ？',
      node.name,
      ConfirmationTargets.NODE,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  jumpTo(cluster: string) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/node/${cluster}`);
    this.retrieve();
  }

}
