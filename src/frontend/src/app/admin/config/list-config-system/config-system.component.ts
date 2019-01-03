import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from '../../../shared/client/v1/config.service';

@Component({
  selector: 'config-system',
  templateUrl: 'config-system.component.html'
})
export class ConfigSystemComponent implements OnInit, OnDestroy {

  configs: any;

  subscription: Subscription;

  constructor(
    private configService: ConfigService,
    private messageHandlerService: MessageHandlerService) {
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
