import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets, ResourcesActionType } from '../../../shared/shared.const';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PublishSecretTplComponent } from '../publish-tpl/publish-tpl.component';
import { Secret } from '../../../shared/model/v1/secret';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { SecretTplService } from '../../../shared/client/v1/secrettpl.service';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { DiffService } from '../../../shared/diff/diff.service';

@Component({
  selector: 'list-secret',
  templateUrl: 'list-secret.component.html',
  styleUrls: ['list-secret.scss']
})
export class ListSecretComponent implements OnInit, OnDestroy {
  selected: SecretTpl[] = [];
  @Input() showState: object;
  @ViewChild(PublishSecretTplComponent, { static: false })
  publishTpl: PublishSecretTplComponent;

  @Input() secrets: Secret[];
  @Input() secretTpls: SecretTpl[];
  @Input() page: Page;
  @Input() appId: number;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() secretTab = new EventEmitter<number>();
  @Output() cloneTpl = new EventEmitter<SecretTpl>();
  subscription: Subscription;

  componentName = '加密字典';

  constructor(private secretTplService: SecretTplService,
              private tplDetailService: TplDetailService,
              private messageHandlerService: MessageHandlerService,
              private route: ActivatedRoute,
              private diffService: DiffService,
              private aceEditorService: AceEditorService,
              private router: Router,
              public authService: AuthService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.SECRET_TPL) {
        const tplId = message.data;
        this.secretTplService.deleteById(tplId, this.appId)
          .subscribe(
            response => {
              this.messageHandlerService.showSuccess(this.componentName + '模版删除成功！');
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

  diffTpl() {
    this.diffService.diff(this.selected);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  tplDetail(tpl: SecretTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  cloneSecretTpl(tpl: SecretTpl) {
    this.cloneTpl.emit(tpl);
  }

  detailSecretTpl(tpl: SecretTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  publishSecretTpl(tpl: SecretTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.PUBLISH);
  }

  offlineSecretTpl(tpl: SecretTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.OFFLINE);
  }

  deleteSecretTpl(tpl: SecretTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '模版确认',
      `你确认删除` + this.componentName + `${tpl.name}？`,
      tpl.id,
      ConfirmationTargets.SECRET_TPL,
      ConfirmationButtons.DELETE_CANCEL
    );
    this.deletionDialogService.openComfirmDialog(deletionMessage);
  }

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  published(success: boolean) {
    if (success) {
      this.refresh();
    }
  }
}
