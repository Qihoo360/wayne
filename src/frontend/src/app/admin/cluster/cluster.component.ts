import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { CreateEditClusterComponent } from './create-edit-cluster/create-edit-cluster.component';
import { ListClusterComponent } from './list-cluster/list-cluster.component';
import { Cluster } from '../../shared/model/v1/cluster';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss']
})
export class ClusterComponent implements OnInit, OnDestroy {
  @ViewChild(ListClusterComponent, { static: false })
  list: ListClusterComponent;
  @ViewChild(CreateEditClusterComponent, { static: false })
  createEdit: CreateEditClusterComponent;

  pageState: PageState = new PageState();
  clusters: Cluster[];

  subscription: Subscription;

  constructor(
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CLUSTER) {
        const name = message.data;
        this.clusterService
          .deleteByName(name)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('集群删除成功！');
              this.retrieve();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.clusterService.list(this.pageState, 'false')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.clusters = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createCluster(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditCluster();
  }

  deleteCluster(cluster: Cluster) {
    const deletionMessage = new ConfirmationMessage(
      '删除集群确认',
      '你确认删除集群 ' + cluster.name + ' ？',
      cluster.name,
      ConfirmationTargets.CLUSTER,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editCluster(cluster: Cluster) {
    this.createEdit.newOrEditCluster(cluster.name);
  }
}
