import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { ApiKey } from '../../../shared/model/v1/apikey';
import { TokenDetailComponent } from '../token-detail/token-detail';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'list-apikey',
  templateUrl: 'list-apikey.component.html',
  styleUrls: ['list-apikey.scss']
})
export class ListApiKeyComponent implements OnInit {
  @Input() showState: object;
  @ViewChild(TokenDetailComponent)
  tokenDetailComponent: TokenDetailComponent;

  @Input() apiKeys: ApiKey[];
  @Input() page: Page;
  currentPage: number = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<ApiKey>();
  @Output() edit = new EventEmitter<ApiKey>();



  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {

  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state?: State) {
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
