import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { State } from '@clr/angular';
import { ListNamespaceComponent } from './list-namespace/list-namespace.component';
import { CreateEditNamespaceComponent } from './create-edit-namespace/create-edit-namespace.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { Namespace } from '../../shared/model/v1/namespace';
import { NamespaceService } from '../../shared/client/v1/namespace.service';
import { PageState } from '../../shared/page/page-state';
import { ClusterService } from '../../shared/client/v1/cluster.service';
import { Cluster } from '../../shared/model/v1/cluster';

@Component({
  selector: 'wayne-namespace',
  templateUrl: './namespace.component.html',
  styleUrls: ['./namespace.component.scss']
})
export class NamespaceComponent implements OnInit {
  @ViewChild(ListNamespaceComponent)
  listNamespace: ListNamespaceComponent;
  @ViewChild(CreateEditNamespaceComponent)
  createEditNamespace: CreateEditNamespaceComponent;

  pageState: PageState = new PageState();
  changedNamespaces: Namespace[];

  subscription: Subscription;

  clusters: Cluster[];

  constructor(
    private namespaceService: NamespaceService,
    private breadcrumbService: BreadcrumbService,
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/namespace', '命名空间列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/namespace/trash', '已删除命名空间列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.NAMESPACE) {
        let namespaceId = message.data;
        this.namespaceService.deleteNamespace(namespaceId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('命名空间删除成功！');
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
    this.clusterService.getNames().subscribe(
      response => {
        this.clusters = response.data;
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

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.namespaceService.listNamespace(this.pageState, 'false')
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedNamespaces = data.list;
          if (this.changedNamespaces && this.changedNamespaces.length > 0) {
            for (let ns of this.changedNamespaces) {
              if (!ns.metaData) {
                ns.metaData = '{}';
              }
              ns.metaDataObj = Namespace.ParseNamespaceMetaData(ns.metaData);
            }
          }
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createNamespace(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deleteNamespace(ns: Namespace) {
    const deletionMessage = new ConfirmationMessage(
      '删除命名空间确认',
      '确认删除命名空间 ' + ns.name + ' ？',
      ns.id,
      ConfirmationTargets.NAMESPACE,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditNamespace.newOrEditNamespace(this.clusters);
  }

  initDefault(): void {
    this.namespaceService.initDefault().subscribe(
      response => {
        this.messageHandlerService.showSuccess('默认命名空间初始化成功！');
        this.retrieve();
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

  editNamespace(ns: Namespace): void {
    this.createEditNamespace.newOrEditNamespace(this.clusters, ns.id);
  }
}
