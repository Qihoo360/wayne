import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { MessageHandlerService } from '../message-handler/message-handler.service';
import { AuthService } from './auth.service';
import { defaultRoutingUrl } from '../shared.const';

@Injectable()
export class AdminAuthCheckGuard implements CanActivate, CanActivateChild {

  constructor(public authService: AuthService,
              private router: Router,
              private messageHandlerService: MessageHandlerService,
              private msgHandler: MessageHandlerService) {
  }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    // When routing change, clear
    this.msgHandler.clear();

    return new Promise((resolve, reject) => {
      if (!this.authService.currentUser) {
        this.authService.retrieveUser().then(() => {
            if (this.authService.currentUser.admin) {
              resolve(true);
            } else {
              this.router.navigate([defaultRoutingUrl]);
              resolve(false);
            }
          }
        ).catch(
          error => {
            this.messageHandlerService.handleError(error);
            return resolve(false);
          }
        );
      } else {
        if (this.authService.currentUser.admin) {
          resolve(true);
        } else {
          this.router.navigate([defaultRoutingUrl]);
          resolve(false);
        }
      }
      // Before activating, we firstly need to confirm whether the route is coming from peer part - admiral
      return resolve(true);
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
