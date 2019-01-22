import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { MessageHandlerService } from '../message-handler/message-handler.service';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { AppService } from '../client/v1/app.service';

@Injectable()
export class AuthCheckGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private appService: AppService,
              private route: ActivatedRoute,
              public authService: AuthService,
              public cacheService: CacheService,
              private messageHandlerService: MessageHandlerService,
              private msgHandler: MessageHandlerService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    // When routing change, clear
    this.msgHandler.clear();
    return new Promise((resolve, reject) => {
      if (!this.authService.currentUser) {
        this.authService.retrieveUser().then(() => {
          this.setCache(state);
          resolve(true);
        }).catch(
          error => {
            this.messageHandlerService.handleError(error);
            return resolve(false);
          }
        );
      } else {
        this.setCache(state);
        return resolve(true);
      }
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  setCache(state: RouterStateSnapshot) {
    if (state.url.indexOf('/portal/namespace/') > -1) {
      const nid = parseInt(state.url.split('/')[3], 10);
      if (this.cacheService.namespaces.length > 0) {
        let namespace = this.defaultNamespace();
        for (const ns of this.cacheService.namespaces) {
          if (ns.id === nid) {
            namespace = ns;
          }
        }
        this.cacheService.setNamespace(namespace);
      }
    }
    const reg = new RegExp('^/portal/namespace/([0-9]*)/app/([0-9]*)');
    if (reg.test(state.url)) {
      const appId = parseInt(state.url.split('/')[5], 10);
      this.cacheService.setAppId(appId);
    }

  }

  defaultNamespace(): any {
    const namespaceId = localStorage.getItem('namespace');
    if (namespaceId) {
      for (const ns of this.cacheService.namespaces) {
        if (ns.id.toString() === namespaceId) {
          return ns;
        }
      }
    }
    return this.cacheService.namespaces ? this.cacheService.namespaces[0] : null;
  }
}
