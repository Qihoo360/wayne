import { Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { Event } from '../model/v1/deploymenttpl';
import { EventClient } from '../client/v1/kubernetes/event';
import { PageComponent } from '../base/page';
import { ClrDatagridStateInterface } from '@clr/angular';
import { PageState } from '../page/page-state';
import { CacheService } from '../auth/cache.service';
import { KubeResourcesName } from '../shared.const';
import { ActivatedRoute } from '@angular/router';
import { MessageHandlerService } from '../message-handler/message-handler.service';

@Component({
  selector: 'list-event-datagrid',
  templateUrl: 'list-event.component.html',
  styleUrls: ['list-event.scss']
})

export class ListEventDatagridComponent extends PageComponent implements OnInit {
  @Input() cluster: string;
  @Input() resourceType: KubeResourcesName;
  @Input() resourceName: string;

  checkOnGoing = false;
  isSubmitOnGoing = false;
  modalOpened: boolean;
  events: Event[];


  constructor(private eventClient: EventClient,
              private cacheService: CacheService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService) {
    super();
  }

  get appId(): number {
    return parseInt(this.route.parent.snapshot.params['id'], 10);
  }


  ngOnInit(): void {
  }

  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      this.state = state;
      this.pageState = PageState.fromState(state, {totalPage: this.pageState.page.totalPage, totalCount: this.pageState.page.totalCount});
    }
    if (this.cluster) {
      this.eventClient.listPageByResouce(
        this.pageState, this.cluster, this.cacheService.kubeNamespace, this.resourceType,
        this.resourceName, this.appId)
        .subscribe(
          response => {
            const data = response.data;
            this.events = data.list;
            this.pageState.page.totalPage = data.totalPage;
            this.pageState.page.totalCount = data.totalCount;
          },
          error => {
            this.events = null;
            this.messageHandlerService.handleError(error);
          }
        );
    }

  }


}


