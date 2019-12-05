import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class SideNavService {
  private _routerChange: Subject<string> = new Subject<string>();
  private monitorControl = new Subject<any>();
  monitorObservable$ = this.monitorControl.asObservable();
  private monitorList = new Subject<any>();
  monitorListObservable$ = this.monitorList.asObservable();
  get routerChange(): Observable<string> {
    return this._routerChange.asObservable();
  }
  constructor(
    private router: Router,
    private http: HttpClient
    ) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.routerChangeTrigger(event.url);
        }
      }
    );
  }
  getMonitors(namespace: number): Observable<any> {
    return this.http.get(`/api/v1/namespaces/${namespace}/customlink/links`)
      .catch(error => throwError(error));
  }
  routerChangeTrigger(url: string): void {
    this._routerChange.next(url);
  }
  setMonitorConfig(config: any) {
    this.monitorControl.next(config);
  }
  setMonitorList(list: any[]) {
    this.monitorList.next(list);
  }
}
