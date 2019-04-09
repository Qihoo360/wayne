import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { CacheService } from '../../shared/auth/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../shared/client/v1/storage.service';
import { SideNavCollapse } from '../../shared/base/side-nav/side-nav-collapse';
@Component({
  selector: 'wayne-sidenav-namespace',
  templateUrl: './sidenav-namespace.component.html',
  styleUrls: ['./sidenav-namespace.component.scss']
})

export class SidenavNamespaceComponent extends SideNavCollapse {

  constructor(
    public authService: AuthService,
    public cacheService: CacheService,
    public translate: TranslateService,
    private router: Router,
    public storage: StorageService
  ) {
    super(storage);
  }


  navigateByUrl(link: string) {
    this.router.navigateByUrl(`portal/namespace/${this.cacheService.namespaceId}/${link}`);
  }

}
