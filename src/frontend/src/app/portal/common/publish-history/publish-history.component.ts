import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { PublishHistory } from '../../../shared/model/v1/publish-history';
import { PublishType } from '../../../shared/shared.const';
import { PublishService } from '../../../shared/client/v1/publish.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { PublishHistoryService } from './publish-history.service';
import { Subscription } from 'rxjs/Subscription';
import { PageState } from '../../../shared/page/page-state';

@Component({
  selector: 'publish-history',
  templateUrl: 'publish-history.component.html',
  styleUrls: ['publish-history.scss']
})

export class PublishHistoryComponent implements OnInit, OnDestroy {
  modalOpened: boolean;
  type: PublishType;
  resourceId: number;
  resourceName: string;
  historySub: Subscription;
  publishHistories: PublishHistory[];
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  constructor(private publishService: PublishService,
              private publishHistoryService: PublishHistoryService,
              private messageHandlerService: MessageHandlerService) {
  }

  openModal(type: PublishType, resourceId: number) {
    this.modalOpened = true;
    this.type = type;
    this.resourceId = resourceId;
  }

  ngOnInit(): void {
    this.historySub = this.publishHistoryService.publishHistory$.subscribe(
      history => {
        this.modalOpened = true;
        this.type = history.type;
        this.resourceId = history.resourceId;
        this.refresh();
      }
    );
  }

  ngOnDestroy() {
    if (this.historySub) {
      this.historySub.unsubscribe();
    }
  }

  initState() {
    this.state = {
      page: {}
    };
  }

  pageSizeChange(pageSize: number) {
    if (!this.state) {
      this.initState();
    }
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface): void {
    if (this.type == null || this.resourceId == null) {
      return;
    }
    this.resourceName = null;
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {
        totalPage: this.pageState.page.totalPage,
        totalCount: this.pageState.page.totalCount
      });
    }
    this.publishService.listHistories(this.pageState, this.type, this.resourceId).subscribe(
      response => {
        const data = response.data;
        this.pageState.page.totalPage = data.totalPage;
        this.pageState.page.totalCount = data.totalCount;
        this.publishHistories = data.list;

        if (data.list.length > 0) {
          this.resourceName = data.list[0].resourceName;
        }
      },
      error => this.messageHandlerService.handleError(error)
    );
  }

}


