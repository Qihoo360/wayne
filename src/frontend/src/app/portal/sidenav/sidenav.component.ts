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
  config: any = {};
  constructor(
    public authService: AuthService,
    public cacheService: CacheService,
    private appService: AppService,
    public storage: StorageService,
    private sideNavService: SideNavService
  ) {
    super(storage);
    this.sideNavService.monitorObservable$.subscribe(config => {
      const { cluster, deploymentName } = config;
      if (cluster) {
        this.config['var-datasource'] = `prometheus-k8s-${cluster}`;
        this.config['var-idc'] = cluster;
      } else {
        this.config['var-datasource'] = '';
        this.config['var-idc'] = '';
      }
      if (deploymentName) {
        this.config['var-deployment'] = deploymentName;
      }
    });
    this.sideNavService.monitorListObservable$.subscribe(list => {
      this.monitors = list;
    });
  }

  goToMonitor(url) {
    window.open(
      url.replace('{{var-app}}', this.appService.app.name)
        .replace('{{var-namespace}}', this.cacheService.namespace.name)
        .replace('{{var-datasource}}', this.config['var-datasource'])
        .replace('{{var-idc}}', this.config['var-idc'])
        .replace('{{var-deployment}}', this.config['var-deployment'])
    );
  }
}
