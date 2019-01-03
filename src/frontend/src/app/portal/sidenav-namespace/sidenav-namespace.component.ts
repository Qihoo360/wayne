import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { AppService } from '../../shared/client/v1/app.service';
import { CacheService } from '../../shared/auth/cache.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wayne-sidenav-namespace',
  templateUrl: './sidenav-namespace.component.html',
  styleUrls: ['./sidenav-namespace.component.scss']
})

export class SidenavNamespaceComponent implements OnInit {

  constructor(public authService: AuthService,
              private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService,
              private appService: AppService,
              public translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
  }

  navigateByUrl(link: string) {
    this.router.navigateByUrl(`portal/namespace/${this.cacheService.namespaceId}/${link}`);
  }

}
