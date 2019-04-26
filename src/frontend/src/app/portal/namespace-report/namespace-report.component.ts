import { Component, OnInit, ViewChild } from '@angular/core';
import { NamespaceClient } from 'wayne-component/lib/client/v1/kubernetes/namespace';
import { CacheService } from 'wayne-component/lib/auth/cache.service';
import { MessageHandlerService } from 'wayne-component';
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
  @ViewChild(HistoryComponent)
  historyComponent: HistoryComponent;
  @ViewChild(ResourceComponent)
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
