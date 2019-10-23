import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { AppService } from '../../shared/client/v1/app.service';
import { CacheService } from '../../shared/auth/cache.service';
import { StorageService } from '../../shared/client/v1/storage.service';
import { SideNavCollapse } from '../../shared/base/side-nav/side-nav-collapse';
import { SideNavService } from 'app/shared/client/v1/sidenav.service';

@Component({
  selector: 'wayne-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent extends SideNavCollapse {

  monitors: any[] = [];
  icons = ['dashboard', 'world', 'bullseye'];
  constructor(
    public authService: AuthService,
    public cacheService: CacheService,
    private appService: AppService,
    public storage: StorageService,
    private sideNavService: SideNavService
  ) {
    super(storage);
    this.getMonitors(this.cacheService.namespace.id);
  }

  getMonitors(namespaceId: number) {
    this.sideNavService.getMonitors(namespaceId)
    .subscribe(res => {
      this.monitors = res.data || [];
    });
  }

  goToMonitor(url) {
    window.open(
      url.replace('{{app}}', this.appService.app.name)
      .replace('{{namespace}}', this.cacheService.namespace.name));
  }

  getMonitorUri() {
    return this.cacheService.currentNamespace.metaDataObj['system.monitor-url']
        || this.authService.config['system.monitor-uri'];
  }

}
