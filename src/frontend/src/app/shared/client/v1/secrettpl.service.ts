import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { SecretTpl } from '../../model/v1/secrettpl';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';

@Injectable()
export class SecretTplService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  getNames(appId?: number): Observable<any> {
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = 0;
    }
    return this.http
      .get(`/api/v1/apps/${appId}/secrets/tpls/names`)

      .catch(error => Observable.throw(error));
  }

  listPage(pageState: PageState, appId?: number, secretId?: string, needStatus?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = 0;
    }
    params = params.set('secretId', secretId === undefined ? '' : secretId.toString());
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
      .get(`/api/v1/apps/${appId}/secrets/tpls`, {params: params})

      .catch(error => Observable.throw(error));
  }

  create(secretTpl: SecretTpl, appId: number): Observable<any> {
    return this.http
      .post(`/api/v1/apps/${appId}/secrets/tpls`, secretTpl, this.options)

      .catch(error => Observable.throw(error));
  }

  update(secretTpl: SecretTpl, appId: number): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${appId}/secrets/tpls/${secretTpl.id}`, secretTpl, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteById(id: number, appId: number, logical?: boolean): Observable<any> {
    let options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }

    return this.http
      .delete(`/api/v1/apps/${appId}/secrets/tpls/${id}`, options)

      .catch(error => Observable.throw(error));
  }

  getById(id: number, appId: number): Observable<any> {
    return this.http
      .get(`/api/v1/apps/${appId}/secrets/tpls/${id}`)

      .catch(error => Observable.throw(error));
  }
}
