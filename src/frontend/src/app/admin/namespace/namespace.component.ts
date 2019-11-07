import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
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
import { MigrateNamespaceComponent } from './migrate-namespace/migrate-namespace.component';

@Component({
  selector: 'wayne-namespace',
  templateUrl: './namespace.component.html',
  styleUrls: ['./namespace.component.scss']
})
export class NamespaceComponent implements OnInit, OnDestroy {
  @ViewChild(ListNamespaceComponent, { static: false })
  listNamespace: ListNamespaceComponent;
  @ViewChild(CreateEditNamespaceComponent, { static: false })
  createEditNamespace: CreateEditNamespaceComponent;
  @ViewChild(MigrateNamespaceComponent, {static: false})
  migrateNamespaceComponent: MigrateNamespaceComponent;

  pageState: PageState = new PageState();
  changedNamespaces: Namespace[];

  subscription: Subscription;

  clusters: Cluster[];

  constructor(
    private namespaceService: NamespaceService,
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.NAMESPACE) {
        const namespaceId = message.data;
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

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.namespaceService.listNamespace(this.pageState, 'false')
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedNamespaces = data.list;
          if (this.changedNamespaces && this.changedNamespaces.length > 0) {
            for (const ns of this.changedNamespaces) {
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

  migrateNamespace(ns: Namespace): void {
    const pageState = new PageState({
      pageNo: 1,
      pageSize: 10000
    });
    this.namespaceService.listNamespace(pageState, 'false')
      .subscribe(res => {
        this.migrateNamespaceComponent.open(ns, res.data.list);
      });
  }
}
