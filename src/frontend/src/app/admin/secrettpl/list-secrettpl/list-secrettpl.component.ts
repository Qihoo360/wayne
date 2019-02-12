import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { SecretTplService } from '../../../shared/client/v1/secrettpl.service';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-secrettpl',
  templateUrl: 'list-secrettpl.component.html'
})
export class ListSecretTplComponent implements OnInit {

  @Input() secrettpls: SecretTpl[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<SecretTpl>();
  @Output() edit = new EventEmitter<SecretTpl>();

  constructor(
    private secrettplService: SecretTplService,
    private messageHandlerService: MessageHandlerService,
    private router: Router
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

  deleteSecrettpl(secrettpl: SecretTpl) {
    this.delete.emit(secrettpl);
  }

  editSecrettpl(secrettpl: SecretTpl) {
    this.edit.emit(secrettpl);
  }
}
