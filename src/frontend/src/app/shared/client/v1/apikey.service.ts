import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { ApiKey } from '../../model/v1/apikey';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ApiKeyService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listPage(pageState: PageState, namespaceId?: number, appId?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
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
    if (Object.keys(pageState.sort).length !== 0) {
      let sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }

    return this.http
      .get(this.buildAPIKeyUrl(namespaceId, appId), {params: params})

      .catch(error => Observable.throw(error));
  }

  buildAPIKeyUrl(namespaceId?: number, appId?: number): string {
    let url = '';
    if (isNotEmpty(namespaceId)) {
      url = `/api/v1/namespaces/${namespaceId}/apikeys`;
    }
    if (isNotEmpty(appId)) {
      url = `/api/v1/apps/${appId}/apikeys`;
    }
    return url;
  }

  create(apiKey: ApiKey, namespaceId?: number, appId?: number): Observable<any> {
    return this.http
      .post(this.buildAPIKeyUrl(namespaceId, appId), apiKey, this.options)

      .catch(error => Observable.throw(error));
  }

  update(apiKey: ApiKey, namespaceId?: number, appId?: number): Observable<any> {
    return this.http
      .put(`${this.buildAPIKeyUrl(namespaceId, appId)}/${apiKey.id}`, apiKey, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteById(id: number, logical?: boolean, namespaceId?: number, appId?: number): Observable<any> {
    let options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }

    return this.http
      .delete(`${this.buildAPIKeyUrl(namespaceId, appId)}/${id}`, options)

      .catch(error => Observable.throw(error));
  }

  getById(id: number, namespaceId?: number, appId?: number): Observable<any> {
    return this.http.get(`${this.buildAPIKeyUrl(namespaceId, appId)}/${id}`)

      .catch(error => Observable.throw(error));
  }
}
