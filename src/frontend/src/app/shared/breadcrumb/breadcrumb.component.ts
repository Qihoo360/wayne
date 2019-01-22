import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from '../client/v1/breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'wayne-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  @Input() prefix = '';
  urls: string[] = new Array();
  private routerSubscription: Subscription;

  constructor(public router: Router, private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {
    this.generateTrail(this.router.url);
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.urls.length = 0;
        this.generateTrail(event.url);
      }
    });
  }

  navigateTo(url: string, avail: boolean) {
    if (avail) {
      this.router.navigateByUrl(url);
    }
  }

  generateTrail(url: string) {
    if (url === '') {
      return;
    }
    if (!this.breadcrumbService.isRouteHidden(url)) {
      this.urls.unshift(url);
    }
    if (url.indexOf('/') > -1) {
      this.generateTrail(url.substr(0, url.lastIndexOf('/')));
    } else if (this.prefix.length > 0) {
      this.urls.unshift(this.prefix);
    }
  }

  friendlyName(url: string) {
    return this.breadcrumbService.getFriendName(url);
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

}
