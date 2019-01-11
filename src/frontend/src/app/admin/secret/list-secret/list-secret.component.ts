import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Secret } from '../../../shared/model/v1/secret';
import { SecretService } from '../../../shared/client/v1/secret.service';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-secret',
  templateUrl: 'list-secret.component.html'
})
export class ListSecretComponent implements OnInit {

  @Input() secrets: Secret[];

  @Input() page: Page;
  currentPage = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<Secret>();
  @Output() edit = new EventEmitter<Secret>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private secretService: SecretService,
    private messageHandlerService: MessageHandlerService,
    private router: Router,
    private aceEditorService: AceEditorService
  ) {
    breadcrumbService.hideRoute('/admin/secret/relate-tpl');
    breadcrumbService.hideRoute('/admin/secret/app');
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteSecret(secret: Secret) {
    this.delete.emit(secret);
  }

  editSecret(secret: Secret) {
    this.edit.emit(secret);
  }

  goToLink(secret: Secret, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'tpl':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/secret/relate-tpl/[0-9]*', '[' + secret.name + ']模板列表');
        linkUrl = ['admin', 'secret', 'relate-tpl', secret.id];
        break;
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/secret/app/[0-9]*', '[' + secret.app.name + ']项目详情');
        linkUrl = ['admin', 'secret', 'app', secret.app.id];
        break;
      default:
        break;
    }
    this.router.navigate(linkUrl);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
