import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Namespace } from '../../model/v1/namespace';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { throwError } from 'rxjs';

@Injectable()
export class NamespaceService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listNamespace(pageState: PageState, deleted?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('deleted', deleted);
    Object.getOwnPropertyNames(pageState.params).map(key => {
      const value = pageState.params[key];
      if (isNotEmpty(value)) {
        params = params.set(key, value);
      }
    });
    const filterList: Array<string> = [];
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      const value = pageState.filters[key];
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
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/namespaces', {params: params})
      //
      .catch(error => throwError(error));
  }

  getNames(): Observable<any> {
    return this.http
      .get('/api/v1/namespaces/names')

      .catch(error => throwError(error));
  }

  createNamespace(ns: Namespace): Observable<any> {
    return this.http
      .post(`/api/v1/namespaces`, ns, this.options)

      .catch(error => throwError(error));
  }

  updateNamespace(ns: Namespace): Observable<any> {
    return this.http
      .put(`/api/v1/namespaces/${ns.id}`, ns, this.options)

      .catch(error => throwError(error));
  }

  deleteNamespace(nsId: number, logical?: boolean): Observable<any> {
    const options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }
    return this.http
      .delete(`/api/v1/namespaces/${nsId}`, options)

      .catch(error => throwError(error));
  }

  getNamespace(nsId: number): Observable<any> {
    return this.http
      .get(`/api/v1/namespaces/${nsId}`)

      .catch(error => throwError(error));
  }

  initDefault(): Observable<any> {
    return this.http.get(`/api/v1/namespaces/init`)

      .catch(error => throwError(error));
  }


  getHistory(namespaceId: number, appName?: string): Observable<any> {
    let params = new HttpParams();
    if (appName) {
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/namespaces/${namespaceId}/history`, {params: params})
      .catch(error => throwError(error));
  }

  migrateNamespace(sourceId: number, targetId: number) {
    return this.http
      .post(`/api/v1/namespaces/migration`, {
        sourceId,
        targetId
      })
      .catch(error => throwError(error));
  }
}
