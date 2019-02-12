import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { StatefulsetTemplate } from '../../model/v1/statefulsettpl';
import { throwError } from 'rxjs';

@Injectable()
export class StatefulsetTplService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listPage(pageState: PageState, appId?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    // query param
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
      .get(`/api/v1/apps/${appId}/statefulsets/tpls`, {params: params})

      .catch(error => throwError(error));
  }

  create(tpl: StatefulsetTemplate, appId: number): Observable<any> {
    return this.http
      .post(`/api/v1/apps/${appId}/statefulsets/tpls`, tpl)

      .catch(error => throwError(error));
  }

  update(tpl: StatefulsetTemplate, appId: number): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${appId}/statefulsets/tpls/${tpl.id}`, tpl, this.options)

      .catch(error => throwError(error));
  }

  deleteById(id: number, appId: number, logical?: boolean): Observable<any> {
    const options: any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params;
    }

    return this.http
      .delete(`/api/v1/apps/${appId}/statefulsets/tpls/${id}`, options)

      .catch(error => throwError(error));
  }

  getById(id: number, appId: number): Observable<any> {
    return this.http
      .get(`/api/v1/apps/${appId}/statefulsets/tpls/${id}`)

      .catch(error => throwError(error));
  }

}
