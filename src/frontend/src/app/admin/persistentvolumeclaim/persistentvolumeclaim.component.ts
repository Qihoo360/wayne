import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListPersistentVolumeClaimComponent } from './list-persistentvolumeclaim/list-persistentvolumeclaim.component';
import { CreateEditPersistentVolumeClaimComponent } from './create-edit-persistentvolumeclaim/create-edit-persistentvolumeclaim.component';
import { PersistentVolumeClaimService } from '../../shared/client/v1/persistentvolumeclaim.service';
import { PersistentVolumeClaim } from '../../shared/model/v1/persistentvolumeclaim';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-persistentvolumeclaim',
  templateUrl: './persistentvolumeclaim.component.html',
  styleUrls: ['./persistentvolumeclaim.component.scss']
})
export class PersistentVolumeClaimComponent implements OnInit, OnDestroy {
  @ViewChild(ListPersistentVolumeClaimComponent, { static: false })
  list: ListPersistentVolumeClaimComponent;
  @ViewChild(CreateEditPersistentVolumeClaimComponent, { static: false })
  createEdit: CreateEditPersistentVolumeClaimComponent;

  pageState: PageState = new PageState();
  pvcs: PersistentVolumeClaim[];
  appId: string;
  componentName = 'PVC';

  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private pvcService: PersistentVolumeClaimService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM) {
        const id = message.data;
        this.pvcService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('PVC删除成功！');
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
    this.route.params.subscribe(params => {
      this.appId = params['aid'];
      if (typeof (this.appId) === 'undefined') {
        this.appId = '';
      }
    });
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
    this.pvcService.list(this.pageState, 'false', this.appId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.pvcs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createPvc(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditPvc();
  }

  deletePvc(pvc: PersistentVolumeClaim) {
    const deletionMessage = new ConfirmationMessage(
      '删除PVC确认',
      '你确认删除PVC ' + pvc.name + ' ？',
      pvc.id,
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editPvc(pvc: PersistentVolumeClaim) {
    this.createEdit.newOrEditPvc(pvc.id);
  }
}
