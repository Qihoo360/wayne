import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { SideNavService } from '../../shared/client/v1/sidenav.service';
import { adminSideNav } from '../../shared/sidenav.const';
import { SideNavExpand } from '../../shared/base/side-nav/side-nav-expand';
import { StorageService } from '../../shared/client/v1/storage.service';

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
