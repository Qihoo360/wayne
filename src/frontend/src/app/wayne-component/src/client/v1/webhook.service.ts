import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { WebHook } from '../../model/v1/webhook';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';

@Injectable()
export class WebHookService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  get(scope: number, scopeId: number, id: number): Observable<any> {
    let restUrl: string;
    if (scope === 0) { // Namespace
      restUrl = `/api/v1/namespaces/${scopeId}/webhooks/${id}`;
    } else if (scope === 1) { // App
      restUrl = `/api/v1/apps/${scopeId}/webhooks/${id}`;
    } else {
      throwError('invalid scope');
    }

    return this.http
      .get(restUrl, this.options)

      .catch(error => throwError(error));
  }

  query(pageState: PageState, scope: number, scopeId: number): Observable<any> {
    let params = new HttpParams({
      fromObject: {
        pageNo: pageState.page.pageNo + '',
        pageSize: pageState.page.pageSize + '',
      }
    });

    const filterList: Array<string> = [];
    if ('filters' in pageState) {
      for (const key in pageState.filters) {
        if (pageState.hasOwnProperty(key)) {
          const value = pageState.filters[key];
          if (isNotEmpty(value)) {
            if (key === 'name' || key === 'url') {
              filterList.push(`${key}__contains=${value}`);
            } else {
              filterList.push(`${key}=${value}`);
            }
          }
        }
      }
    }
    if (filterList.length) {
      params = params = params.set('filter', filterList.join(','));
    }
    if ('sort' in pageState) {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      if (sortType) {
        params = params = params.set('sortby', sortType);
      }
    }
    let restUrl: string;
    if (scope === 0) { // Namespace
      restUrl = `/api/v1/namespaces/${scopeId}/webhooks`;
    } else if (scope === 1) { // App
      restUrl = `/api/v1/apps/${scopeId}/webhooks`;
    } else {
      throwError('invalid scope');
    }

    return this.http
      .get(restUrl, {params: params})

      .catch(error => throwError(error));
  }

  create(webHook: WebHook): Observable<any> {
    let restUrl: string;
    if (webHook.scope === 0) { // Namespace
      restUrl = `/api/v1/namespaces/${webHook.objectId}/webhooks`;
    } else if (webHook.scope === 1) { // App
      restUrl = `/api/v1/apps/${webHook.objectId}/webhooks`;
    }

    return this.http
      .post(restUrl, webHook, this.options)

      .catch(error => throwError(error));
  }

  update(webHook: WebHook): Observable<any> {
    let restUrl: string;
    if (webHook.scope === 0) { // Namespace
      restUrl = `/api/v1/namespaces/${webHook.objectId}/webhooks/${webHook.id}`;
    } else if (webHook.scope === 1) { // App
      restUrl = `/api/v1/apps/${webHook.objectId}/webhooks/${webHook.id}`;
    }

    return this.http
      .put(restUrl, webHook, this.options)

      .catch(error => throwError(error));
  }

  delete(webHook: WebHook): Observable<any> {
    let restUrl: string;
    if (webHook.scope === 0) { // Namespace
      restUrl = `/api/v1/namespaces/${webHook.objectId}/webhooks/${webHook.id}`;
    } else if (webHook.scope === 1) { // App
      restUrl = `/api/v1/apps/${webHook.objectId}/webhooks/${webHook.id}`;
    }

    return this.http
      .delete(restUrl, this.options)

      .catch(error => throwError(error));
  }

  getEvents(): Observable<any> {
    return this.http
      .get(`/api/v1/apps/0/webhooks/events`)

      .catch(error => throwError(error));
  }
}
