import { Injectable } from '@angular/core';


@Injectable()

export class BreadcrumbService {
  /*
        @api addFriendlyNameForRoute(route: string, name: string, avail?: boolean = true)
      如果不存在路由情况下将第三个参数设置成false。防止重定向发生。
        @api addFriendlyNameForRouteRegex(routeRegex: string, name: string, avail?: boolean = true)
        @api hideRoute(route: string)
        @api hideRouteRegex(routeRegex: string)
    */
  private routesFriendlyNames: Map<string, object> = new Map<string, object>();
  private routesFriendlyNamesRegex: Map<string, object> = new Map<string, object>();
  private hideRoutes: any = new Array<string>();
  private hideRoutesRegex: any = new Array<string>();

  constructor() {
  }

  addFriendlyNameForRoute(route: string, name: string, avail: boolean = true) {
    this.routesFriendlyNames.set(route, {name: name, avail: avail});
  }

  addFriendlyNameForRouteRegex(routeRegex: string, name1: string, avail1: boolean = true) {
    this.routesFriendlyNamesRegex.set(routeRegex, {name: name1, avail: avail1});
  }

  hideRoute(route: string) {
    if (this.hideRoutes.indexOf(route) === -1) {
      this.hideRoutes.push(route);
    }
  }

  hideRouteRegex(routeRegex: string): void {
    if (this.hideRoutesRegex.indexOf(routeRegex) === -1) {
      this.hideRoutesRegex.push(routeRegex);
    }
  }

  getFriendName(route: string) {
    let urlInfo: any = new Object();
    const routeEnd = route.substr(route.lastIndexOf('/') + 1, route.length);
    const info: any = this.routesFriendlyNames.get(route);
    if (info !== undefined) {
      urlInfo = Object.assign({}, info);
    }
    this.routesFriendlyNamesRegex.forEach((value, key, map) => {
      if (new RegExp(key).exec(route)) {
        urlInfo = Object.assign({}, value);
      }
    });
    return Object.keys(urlInfo).length ? urlInfo : {name: routeEnd, avail: false};
  }

  isRouteHidden(route: string): boolean {
    let hide = this.hideRoutes.indexOf(route) > -1;

    this.hideRoutesRegex.forEach((value: any) => {
      if (new RegExp(value).exec(route)) {
        hide = true;
      }
    });
    return hide;
  }
}
