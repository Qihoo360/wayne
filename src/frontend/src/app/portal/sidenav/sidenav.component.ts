import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { AppService } from '../../shared/client/v1/app.service';
import { CacheService } from '../../shared/auth/cache.service';
import { StorageService } from '../../shared/client/v1/storage.service';
import { SideNavCollapse } from '../../shared/base/side-nav/side-nav-collapse';
@Component({
  selector: 'wayne-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent extends SideNavCollapse {

  constructor(
    public authService: AuthService,
    public cacheService: CacheService,
    private appService: AppService,
    public storage: StorageService
  ) {
    super(storage);
  }

  goToMonitor() {
    window.open(this.getMonitorUri().toString().replace('{{app.name}}', this.appService.app.name));
  }

  getMonitorUri() {
    return this.cacheService.currentNamespace.metaDataObj['system.monitor-url']
        || this.authService.config['system.monitor-uri'];
  }

}
