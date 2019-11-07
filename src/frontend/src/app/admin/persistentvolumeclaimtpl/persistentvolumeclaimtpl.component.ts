import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import {
  CreateEditPersistentVolumeClaimTplComponent
} from './create-edit-persistentvolumeclaimtpl/create-edit-persistentvolumeclaimtpl.component';
import { PersistentVolumeClaimTplService } from '../../shared/client/v1/persistentvolumeclaimtpl.service';
import { ListPersistentVolumeClaimTplComponent } from './list-persistentvolumeclaimtpl/list-persistentvolumeclaimtpl.component';
import { PersistentVolumeClaimTpl } from '../../shared/model/v1/persistentvolumeclaimtpl';
import { PageState } from '../../shared/page/page-state';
import { isNotEmpty } from '../../shared/utils';

@Component({
  selector: 'wayne-persistentvolumeclaimtpl',
  templateUrl: './persistentvolumeclaimtpl.component.html',
  styleUrls: ['./persistentvolumeclaimtpl.component.scss']
})
export class PersistentVolumeClaimTplComponent implements OnInit, OnDestroy {
  @ViewChild(ListPersistentVolumeClaimTplComponent, { static: false })
  list: ListPersistentVolumeClaimTplComponent;
  @ViewChild(CreateEditPersistentVolumeClaimTplComponent, { static: false })
  createEdit: CreateEditPersistentVolumeClaimTplComponent;

  pageState: PageState = new PageState();
  pvcTpls: PersistentVolumeClaimTpl[];
  pvcId: string;
  componentName = 'PVC模板';

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pvcTplService: PersistentVolumeClaimTplService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_TPL) {
        const id = message.data;
        this.pvcTplService.deleteById(id, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('PVC模版删除成功！');
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
      this.pvcId = params['sid'];
      if (typeof (this.pvcId) === 'undefined') {
        this.pvcId = '';
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
    if (this.route.snapshot.queryParams) {
      Object.getOwnPropertyNames(this.route.snapshot.queryParams).map(key => {
        const value = this.route.snapshot.queryParams[key];
        if (isNotEmpty(value)) {
          this.pageState.filters[key] = value;
        }
      });
    }
    this.pvcTplService.list(this.pageState, 0, 'false', this.pvcId)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.pvcTpls = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createPvcTpl(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEditTpl();
  }

  deletePvcTpl(tpl: PersistentVolumeClaimTpl) {
    const deletionMessage = new ConfirmationMessage(
      '删除PVC模版确认',
      '你确认删除PVC模版 ' + tpl.name + ' ？',
      tpl.id,
      ConfirmationTargets.PERSISTENT_VOLUME_CLAIM_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editPvcTpl(tpl: PersistentVolumeClaimTpl) {
    this.createEdit.newOrEditTpl(tpl.id);
  }
}
