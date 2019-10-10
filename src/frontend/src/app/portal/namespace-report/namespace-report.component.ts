import { Component, OnInit, ViewChild } from '@angular/core';
import { NamespaceClient } from '../../shared/client/v1/kubernetes/namespace';
import { CacheService } from '../../shared/auth/cache.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import * as echarts from 'echarts';

import { HistoryComponent } from './history/history.component';
import { ResourceComponent } from './resource/resource.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wayne-namespace-report.content-container',
  templateUrl: './namespace-report.component.html',
  styleUrls: ['./namespace-report.component.scss']
})

export class NamespaceReportComponent implements OnInit {
  @ViewChild(HistoryComponent, { static: false })
  historyComponent: HistoryComponent;
  @ViewChild(ResourceComponent, { static: false })
  resourceComponent: ResourceComponent;

  constructor(private namespaceClient: NamespaceClient,
              public cacheService: CacheService,
              private messageHandlerService: MessageHandlerService,
              public translate: TranslateService
  ) {
  }

  ngOnInit() {
    const namespaceId = this.cacheService.namespaceId;
  }
}
