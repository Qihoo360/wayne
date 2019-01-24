import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { PageState } from '../../shared/page/page-state';
import { AuditLogService } from '../../shared/client/v1/auditlog.service';
import { AuditLog } from '../../shared/model/v1/auditlog';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';

@Component({
  selector: 'wayne-auditlog',
  templateUrl: './auditlog.component.html'
})
export class AuditLogComponent implements OnInit {
  pageState: PageState = new PageState();
  auditLogs: AuditLog[];
  currentPage = 1;
  state: ClrDatagridStateInterface;

  constructor(private auditLogService: AuditLogService,
              private messageHandlerService: MessageHandlerService) {
  }

  ngOnInit() {

  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }

    if (state.sort) {
      this.pageState.sort.by = state.sort.by.toString();
      this.pageState.sort.reverse = state.sort.reverse;
    } else {
      this.pageState.sort.by = 'id';
      this.pageState.sort.reverse = true;
    }
    this.auditLogService.listPage(this.pageState)
      .subscribe(
        response => {
          const data = response.data;
          this.pageState.page.totalPage = data.totalPage;
          this.pageState.page.totalCount = data.totalCount;
          this.auditLogs = data.list;
        },
        error => this.messageHandlerService.handleError(error)
      );
  }

}
