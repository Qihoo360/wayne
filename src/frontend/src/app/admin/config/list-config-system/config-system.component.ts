import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from '../../../shared/client/v1/config.service';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';

@Component({
  selector: 'config-system',
  templateUrl: 'config-system.component.html'
})
export class ConfigSystemComponent implements OnInit, OnDestroy {

  configs: any;

  subscription: Subscription;

  constructor(private configService: ConfigService,
              private breadcrumbService: BreadcrumbService,
              private messageHandlerService: MessageHandlerService) {
    breadcrumbService.addFriendlyNameForRoute('/admin/config', '系统配置', false);
    breadcrumbService.addFriendlyNameForRoute('/admin/config/system', '文件配置');
  }

  ngOnInit(): void {
    this.configService
      .listSystemConfig()
      .subscribe(
        (response: any) => {
          this.configs = response.data;
        },
        error => this.messageHandlerService.handleError(error)
      );

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getKeys() {
    if (this.configs) {
      return Object.keys(this.configs);
    }
  }
}
