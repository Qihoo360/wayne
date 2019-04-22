import { OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavService } from '../../client/v1/sidenav.service';
import { Subscription } from 'rxjs';
import { SideNavType } from '../../sidenav.const';
import { SideNavCollapse } from './side-nav-collapse';
import { SideNavCollapseStorage } from '../../../shared/sidenav.const';

export class SideNavExpand extends SideNavCollapse implements OnInit, OnDestroy {
  sideNavSub: Subscription;
  currentUrl = this.router.url;
  public adminSideNav: any[];
  sideNavType = SideNavType;
  constructor(
    public sideNav: any[],
    public sideNavService: SideNavService,
    public router: Router,
    public cr: ChangeDetectorRef,
    public storage: any,
    public prefix: string
  ) {
    super(storage);
    this.adminSideNav = this.addMathLinks(sideNav);
  }

  ngOnInit() {
    this._collapsed = this.storage.get(SideNavCollapseStorage) === 'false' ? false : true;
    this.sideNavSub = this.sideNavService.routerChange.subscribe(
      url => {
        this.currentUrl = url.split('?')[0];
        // 取消脏检查
        this.cr.detectChanges();
      }
    );
  }

  public getExpand(matchUrls: string[]): boolean {
    return new RegExp(matchUrls.map(url => `${url}\\b`).join('|')).test(this.currentUrl);
  }

  addMathLinks(sideNav: any[]) {
    sideNav.forEach(item => {
      if (item.type === SideNavType.GroupLink && item.child) {
        item.links = item.child.filter(child => child.a).map(child => `${this.prefix}${child.a.link}`);
      }
    });
    return sideNav;
  }

  public getActive(link: string, option?: any): boolean {
    if (option && option.exact !== undefined) {
      return option.exact ?
        this.currentUrl === `${this.prefix}${link}` :
        new RegExp(`${link}\\b`).test(this.currentUrl);
    } else {
      return this.currentUrl === `${this.prefix}${link}`;
    }
  }

  ngOnDestroy() {
    this.sideNavSub.unsubscribe();
  }
}
