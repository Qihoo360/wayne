import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'trash-cluster',
  templateUrl: 'trash-cluster.component.html'
})
export class TrashClusterComponent implements OnInit, OnDestroy {

  clusters: Cluster[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  subscription: Subscription;

  constructor(private clusterService: ClusterService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.TRASH_CLUSTER) {
        const name = message.data;
        this.clusterService
          .deleteByName(name, false)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('集群删除成功！');
              this.refresh();
            },
            error => {
              this.messageHandlerService.handleError(error);
            }
          );
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.clusterService.list(this.pageState, 'true')
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

  deleteCluster(cluster: Cluster) {
    const deletionMessage = new ConfirmationMessage(
      '删除集群确认',
      '你确认永久删除集群 ' + cluster.name + ' ？删除后将不可恢复！',
      cluster.name,
      ConfirmationTargets.TRASH_CLUSTER,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  recoverCluster(cluster: Cluster) {
    cluster.deleted = false;
    this.clusterService
      .update(cluster)
      .subscribe(
        response => {
          this.messageHandlerService.showSuccess('集群恢复成功！');
          this.refresh();
        },
        error => this.messageHandlerService.handleError(error)
      );
  }
}
