import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import 'rxjs/add/observable/fromPromise';
import { LoginTokenKey } from '../shared.const';
import { resolve } from 'url';
import { DEV_URL, MASTER_URL } from '../../../base-url';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  baseUrl = 'http://test.qihoo.cloud';
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = request.clone({
      url: resolve(request.url.indexOf('assets/') > -1
        ? '/'
        : process.env.NODE_ENV === 'development'
          ? DEV_URL
          : MASTER_URL, request.url)
    });
    return from(this.handleAccess(apiReq, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
    Promise<HttpEvent<any>> {
    const token = localStorage.getItem(LoginTokenKey);
    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (token) {
      headerSettings['Authorization'] = 'Bearer ' + token;
    }
    headerSettings['Content-Type'] = 'application/json';
    const newHeader = new HttpHeaders(headerSettings);

    const changedRequest = request.clone({
      headers: newHeader
    });
    return next.handle(changedRequest).toPromise();
  }

}
