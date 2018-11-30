import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { App } from '../../model/v1/app';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class AppService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};
  app: App;

  constructor(private http: HttpClient) {
  }

  // 以后前端分页统一使用pageState模型，避免无限制增加参数
  listPage(pageState: PageState, namespaceId?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
    // query param
    Object.getOwnPropertyNames(pageState.params).map(key => {
      let value = pageState.params[key];
      if (isNotEmpty(value)) {
        params = params.set(key, value);
      }
    });

    let filterList: Array<string> = [];
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      let value = pageState.filters[key];
      if (isNotEmpty(value)) {
        if (key === 'deleted' || key === 'id') {
          filterList.push(`${key}=${value}`);
        } else {
          filterList.push(`${key}__contains=${value}`);
        }
      }
    });
    if (filterList.length) {
      params = params.set('filter', filterList.join(','));
    }
    // sort param
    if (Object.keys(pageState.sort).length !== 0) {
      let sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }

    if ((typeof (namespaceId) === 'undefined') || (!namespaceId)) {
      namespaceId = '0';
    }
    return this.http
      .get(`/api/v1/namespaces/${namespaceId}/apps`, {params: params})

      .catch(error => Observable.throw(error));
  }

  listResourceCount(namespaceId?: number, appId?: number): Observable<any> {
    if ((typeof (namespaceId) === 'undefined') || (!namespaceId)) {
      namespaceId = 0;
    }
    let options: any = {};
    if (appId != null) {
      let params = new HttpParams();
      params = params.set('app_id', appId + '');
      options.params = params;
    }
    return this.http
      .get(`/api/v1/namespaces/${namespaceId}/statistics`, options)

      .catch(error => Observable.throw(error));
  }

  getNames(namespaceId?: number): Observable<any> {
    if ((typeof (namespaceId) === 'undefined') || (!namespaceId)) {
      namespaceId = 0;
    }
    return this.http
      .get(`/api/v1/namespaces/${namespaceId}/apps/names`)

      .catch(error => Observable.throw(error));
  }

  create(app: App): Observable<any> {
    return this.http
      .post(`/api/v1/namespaces/${app.namespace.id}/apps`, app, this.options)

      .catch(error => Observable.throw(error));
  }

  update(app: App): Observable<any> {
    return this.http
      .put(`/api/v1/namespaces/${app.namespace.id}/apps/${app.id}`, app, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteById(id: number, namespaceId: number, logical?: boolean): Observable<any> {
    let options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }

    return this.http
      .delete(`/api/v1/namespaces/${namespaceId}/apps/${id}`, options)

      .catch(error => Observable.throw(error));
  }

  getById(id: number, namespaceId: number): Observable<any> {
    return this.http.get(`/api/v1/namespaces/${namespaceId}/apps/${id}`)

      .catch(error => Observable.throw(error));
  }

  getStatistics(): Observable<any> {
    return this.http.get(`/api/v1/apps/statistics`)

      .catch(error => Observable.throw(error));
  }
}
