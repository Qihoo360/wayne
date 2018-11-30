import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { State } from '@clr/angular';
import { ListSecretComponent } from './list-secret/list-secret.component';
import { CreateEditSecretComponent } from './create-edit-secret/create-edit-secret.component';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { Secret } from '../../shared/model/v1/secret';
import { SecretService } from '../../shared/client/v1/secret.service';
import { PageState } from '../../shared/page/page-state';

@Component({
  selector: 'wayne-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements OnInit {
  @ViewChild(ListSecretComponent)
  listSecret: ListSecretComponent;
  @ViewChild(CreateEditSecretComponent)
  createEditSecret: CreateEditSecretComponent;

  pageState: PageState = new PageState();
  appId: string;
  changedSecrets: Secret[];
  componentName = '加密字典';

  subscription: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private secretService: SecretService,
    private route: ActivatedRoute,
    private messageHandlerService: MessageHandlerService,
    private deletionDialogService: ConfirmationDialogService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/secret', this.componentName + '列表');
    breadcrumbService.addFriendlyNameForRoute('/admin/secret/trash', '已删除' + this.componentName + '列表');
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.SECRET) {
        let secretId = message.data;
        this.secretService.deleteById(secretId, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('加密文件删除成功！');
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
      if (typeof (this.appId) == 'undefined') {
        this.appId = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retrieve(state?: State): void {
    if (state) {
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    this.secretService.list(this.pageState, 'false', this.appId)
      .subscribe(
        response => {
          let data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedSecrets = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createSecret(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  deleteSecret(secret: Secret) {
    const deletionMessage = new ConfirmationMessage(
      '删除加密文件确认',
      '确认删除加密文件' + secret.name + ' ？',
      secret.id,
      ConfirmationTargets.SECRET,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  openModal(): void {
    this.createEditSecret.newOrEditSecret();
  }

  editSecret(secret: Secret): void {
    this.createEditSecret.newOrEditSecret(secret.id);
  }
}
