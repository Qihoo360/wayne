import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { WebHook } from '../../../shared/model/v1/webhook';
import { AuthService } from '../../../shared/auth/auth.service';
import { Page } from '../../../shared/page/page-state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'list-namespace-webhook',
  templateUrl: 'list-namespace-webhook.component.html',
  styleUrls: ['list-namespace-webhook.scss']
})
export class ListNamespaceWebHookComponent implements OnInit {
  @Input() showState: object;
  @Input() webHooks: WebHook[];
  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<WebHook>();
  @Output() toggle = new EventEmitter<WebHook>();
  @Output() edit = new EventEmitter<WebHook>();

  constructor(
    public authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteWebhook(webHook: WebHook) {
    this.delete.emit(webHook);
  }

  toggleWebhook(webHook: WebHook) {
    this.toggle.emit(webHook);
  }

  editWebhook(webHook: WebHook) {
    this.edit.emit(webHook);
  }
}
