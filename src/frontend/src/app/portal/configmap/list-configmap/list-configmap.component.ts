import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { ConfirmationMessage } from 'wayne-component/lib/confirmation-dialog/confirmation-message';
import { ConfirmationButtons, ConfirmationState, ConfirmationTargets, ResourcesActionType } from 'wayne-component/lib/shared.const';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageHandlerService } from 'wayne-component';
import { PublishConfigMapTplComponent } from '../publish-tpl/publish-tpl.component';
import { ConfigMap } from 'wayne-component/lib/model/v1/configmap';
import { ConfigMapTpl } from 'wayne-component/lib/model/v1/configmaptpl';
import { ConfigMapTplService } from 'wayne-component/lib/client/v1/configmaptpl.service';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { App } from 'wayne-component/lib/model/v1/app';
import { Page } from 'wayne-component/lib/page/page-state';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { DiffService } from 'wayne-component/lib/diff/diff.service';

@Component({
  selector: 'list-configmap',
  templateUrl: 'list-configmap.component.html',
  styleUrls: ['list-configmap.scss']
})
export class ListConfigMapComponent implements OnInit, OnDestroy {
  selected: ConfigMapTpl[] = [];
  @Input() showState: object;
  @ViewChild(PublishConfigMapTplComponent)
  publishTpl: PublishConfigMapTplComponent;

  @Input() app: App;
  @Input() configMaps: ConfigMap[];
  @Input() configMapTpls: ConfigMapTpl[];
  @Input() page: Page;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() configmapTab = new EventEmitter<number>();
  @Output() cloneTpl = new EventEmitter<ConfigMapTpl>();
  subscription: Subscription;

  componentName = '配置集';

  constructor(private configMapTplService: ConfigMapTplService,
              private tplDetailService: TplDetailService,
              private aceEditorService: AceEditorService,
              private diffService: DiffService,
              private messageHandlerService: MessageHandlerService,
              public authService: AuthService,
              private deletionDialogService: ConfirmationDialogService) {
    this.subscription = deletionDialogService.confirmationConfirm$.subscribe(message => {
      if (message &&
        message.state === ConfirmationState.CONFIRMED &&
        message.source === ConfirmationTargets.CONFIGMAP_TPL) {
        const tpl = message.data;
        this.configMapTplService.deleteById(tpl.id, this.app.id)
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
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

  tplDetail(tpl: ConfigMapTpl) {
    this.tplDetailService.openModal(tpl.description);
  }

  cloneConfigMapTpl(tpl: ConfigMapTpl) {
    this.cloneTpl.emit(tpl);
  }

  detailConfigMapTpl(tpl: ConfigMapTpl) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(JSON.parse(tpl.template), false));
  }

  publishConfigMapTpl(tpl: ConfigMapTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.PUBLISH);
  }

  offlineConfigMapTpl(tpl: ConfigMapTpl) {
    this.publishTpl.newPublishTpl(tpl, ResourcesActionType.OFFLINE);
  }

  deleteConfigMapTpl(tpl: ConfigMapTpl): void {
    const deletionMessage = new ConfirmationMessage(
      '删除' + this.componentName + '模版确认',
      `你确认删除` + this.componentName + `${tpl.name}？`,
      tpl,
      ConfirmationTargets.CONFIGMAP_TPL,
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
