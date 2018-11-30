import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { Page } from '../../../shared/page/page-state';
import { ApiKey } from '../../../shared/model/v1/apikey';
import { TokenDetailComponent } from '../token-detail/token-detail';
import { ApiKeyType } from '../../../shared/shared.const';

@Component({
  selector: 'list-apikey',
  templateUrl: 'list-apikey.component.html',
  styleUrls: ['list-apikey.scss']
})
export class ListApiKeyComponent implements OnInit {
  @ViewChild(TokenDetailComponent)
  tokenDetailComponent: TokenDetailComponent;

  @Input() apiKeys: ApiKey[];
  @Input() page: Page;
  currentPage: number = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<ApiKey>();
  @Output() edit = new EventEmitter<ApiKey>();


  constructor() {
  }

  ngOnInit(): void {

  }

  getApiKeyType(apiKey: ApiKey) {
    for (let type of ApiKeyType) {
      if (type.id == apiKey.type) {
        return type.name;
      }
    }
    return '未知类型';
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
