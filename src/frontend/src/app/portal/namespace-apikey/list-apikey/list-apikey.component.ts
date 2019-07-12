import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { ApiKey } from '../../../shared/model/v1/apikey';
import { TokenDetailComponent } from '../token-detail/token-detail';
import { AuthService } from '../../../shared/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'list-apikey',
  templateUrl: 'list-apikey.component.html',
  styleUrls: ['list-apikey.scss']
})
export class ListApiKeyComponent implements OnInit {
  @Input() showState: object;
  @ViewChild(TokenDetailComponent, { static: false })
  tokenDetailComponent: TokenDetailComponent;

  @Input() apiKeys: ApiKey[];
  @Input() page: Page;
  state: ClrDatagridStateInterface;
  currentPage = 1;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<ApiKey>();
  @Output() edit = new EventEmitter<ApiKey>();

  constructor(
    public authService: AuthService,
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

  refresh(state?: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteApiKey(apiKey: ApiKey) {
    this.delete.emit(apiKey);
  }

  editApiKey(apiKey: ApiKey) {
    this.edit.emit(apiKey);
  }

  tokenDetail(apiKey: ApiKey) {
    this.tokenDetailComponent.viewToken(apiKey.token);
  }


}
