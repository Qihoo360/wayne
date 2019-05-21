import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { SideNavService } from 'wayne-component/lib/client/v1/sidenav.service';
import { adminSideNav } from 'wayne-component/lib/sidenav.const';
import { SideNavExpand } from 'wayne-component/lib/base/side-nav/side-nav-expand';
import { StorageService } from 'wayne-component/lib/client/v1/storage.service';

@Component({
  selector: 'wayne-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent extends SideNavExpand {
  constructor(
    public authService: AuthService,
    public sideNavService: SideNavService,
    public router: Router,
    public cr: ChangeDetectorRef,
    public storage: StorageService
  ) {
    // 最后添加 admin 前缀确保完全匹配
    super(adminSideNav, sideNavService, router, cr, storage, '/admin/');
  }
}
