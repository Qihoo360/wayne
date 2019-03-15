import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { App } from '../../shared/model/v1/app';
import { AppService } from '../../shared/client/v1/app.service';
import { CacheService } from '../../shared/auth/cache.service';

@Component({
  selector: 'base',
  templateUrl: 'base.component.html',
  styleUrls: ['base.scss']
})
export class BaseComponent implements OnInit, OnDestroy {
  appId: number;
  showBox = false;
  routerEvent: Subscription;
  @HostBinding('class.content-container') field = true;

  constructor(public authService: AuthService,
              private appService: AppService,
              public cacheService: CacheService,
              private router: Router,
              private route: ActivatedRoute) {
    this.appId = this.route.snapshot.params['id'];
    const namespaceId = this.cacheService.namespaceId;
    this.appService.getById(this.appId, namespaceId).subscribe(
      response => {
        const wayneBetaUrl = this.authService.config['betaUrl'];
        const app: App = response.data;
        // 缓存app信息到 appService 中
        this.appService.app = response.data;
        if (this.appBetaMode(app.metaData) && wayneBetaUrl && window.location.origin !== wayneBetaUrl) {
          window.location.href = `${wayneBetaUrl}${this.router.url}`;
          return;
        }
        // 为了防止本地开发时跳转，项目不是beta模式并且在beta域名下，跳转到正式环境
        if (!this.appBetaMode(app.metaData) && window.location.origin === wayneBetaUrl) {
          window.location.href = `${this.authService.config['appUrl']}${this.router.url}`;
          return;
        }
        if (app.namespace.id !== this.cacheService.namespaceId) {
          console.log('app namespace not equal the current namespace. will redirect to index.',
            app.namespace.id, this.cacheService.namespaceId);
          window.location.href = '/portal/app';
        }
      },
      error => {
        window.location.href = '/portal/app';
      },
    );
  }

  ngOnInit() {
    this.showBox = /tpl/g.test(this.router.url) ? false : true;
    this.authService.setAppPermissionById(this.appId);
    this.routerEvent = this.router.events.subscribe(events => {
      if (events instanceof NavigationStart) {
        if (/tpl/g.test(events.url)) {
          this.showBox = false;
        } else {
          this.showBox = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  appBetaMode(metaData: string) {
    if (metaData) {
      const meta = JSON.parse(metaData);
      if (meta.mode === 'beta') {
        return true;
      }
    }
    return false;
  }

}
