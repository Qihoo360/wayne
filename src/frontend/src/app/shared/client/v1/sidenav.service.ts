import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SideNavService {
  private _routerChange: Subject<string> = new Subject<string>();
  get routerChange(): Observable<string> {
    return this._routerChange.asObservable();
  }
  constructor(private router: Router) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.routerChangeTrigger(event.url);
        }
      }
    );
  }
  routerChangeTrigger(url: string): void {
    this._routerChange.next(url);
  }
}
