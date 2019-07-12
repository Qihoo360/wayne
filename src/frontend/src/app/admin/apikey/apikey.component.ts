import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets } from '../../shared/shared.const';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { CacheService } from '../../shared/auth/cache.service';
import { AuthService } from '../../shared/auth/auth.service';
import { PageState } from '../../shared/page/page-state';
import { ListApiKeyComponent } from './list-apikey/list-apikey.component';
import { CreateEditApiKeyComponent } from './create-edit-apikey/create-edit-apikey.component';
import { ApiKey } from '../../shared/model/v1/apikey';
import { ApiKeyService } from '../../shared/client/v1/apikey.service';

@Component({
  selector: 'wayne-apikey',
  templateUrl: './apikey.component.html',
  styleUrls: ['./apikey.component.scss']
})
export class ApiKeyComponent implements OnInit, OnDestroy {
  @ViewChild(ListApiKeyComponent, { static: false })
  listApiKey: ListApiKeyComponent;
  @ViewChild(CreateEditApiKeyComponent, { static: false })
  createEditApiKey: CreateEditApiKeyComponent;
  changedApiKeys: ApiKey[];
  pageState: PageState = new PageState();

  subscription: Subscription;

  constructor(private apiKeyService: ApiKeyService,
              public cacheService: CacheService,
              public authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.API_KEY) {
        const id = message.data;
        this.apiKeyService
          .deleteById(id, true, null, 0)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess('APIKey设置失效成功！');
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
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.apiKeyService.listPage(this.pageState, null, 0)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.changedApiKeys = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

  createApiKey(created: boolean) {
    if (created) {
      this.retrieve();
    }
  }

  openModal(): void {
    this.createEditApiKey.newOrEdit();
  }

  deleteApiKey(apiKey: ApiKey) {
    const deletionMessage = new ConfirmationMessage(
      'APIKey失效确认',
      '你确认使APIKey ' + apiKey.name + '立即失效 ？',
      apiKey.id,
      ConfirmationTargets.API_KEY,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  editApiKey(apiKey: ApiKey) {
    this.createEditApiKey.newOrEdit(apiKey.id);
  }
}
