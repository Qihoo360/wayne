import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../shared/client/v1/app.service';
import { CacheService } from '../../shared/auth/cache.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';

@Component({
  selector: 'wayne-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {

  constructor(public authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private appService: AppService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  goToMonitor() {
    window.open(this.getMonitorUri().toString().replace('{{app.name}}', this.appService.app.name));
  }

  getMonitorUri() {
    return this.authService.config['system.monitor-uri'];
  }

}
