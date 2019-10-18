import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ListRoadmapComponent } from './list-roadmap/list-roadmap.component';
import { CreateEditRoadmapComponent } from './create-edit-roadmap/create-edit-roadmap.component';
import { PageState } from '../../shared/page/page-state';
import { LinkType } from '../../shared/model/v1/link-type';
import { RoadmapService } from '../../shared/client/v1/roadmap.service';

@Component({
  selector: 'wayne-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit, OnDestroy {
  @ViewChild(ListRoadmapComponent, { static: false })
  list: ListRoadmapComponent;
  @ViewChild(CreateEditRoadmapComponent, { static: false })
  createEdit: CreateEditRoadmapComponent;
  pageState: PageState = new PageState();
  configs: LinkType[];
  subscription: Subscription;

  constructor(
    private roadmapService: RoadmapService,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService
  ) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIG) {
        const id = message.data;
        this.roadmapService
          .deleteById(id)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('配置删除成功！');
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
    this.retrieve();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createConfig(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEdit.newOrEdit();
  }

  retrieve(state?: ClrDatagridStateInterface): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.roadmapService.list(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.configs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  deleteConfig(config: LinkType) {
    const deletionMessage = new ConfirmationMessage(
      '删除配置确认',
      '你确认删除配置 ' + config.typeName + ' ？',
      config.id,
      ConfirmationTargets.CONFIG,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editConfig(config: LinkType) {
    this.createEdit.newOrEdit(config.id);
  }

}
