import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ConfigMap } from '../../model/v1/configmap';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { OrderItem } from '../../model/v1/order';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class ConfigMapService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  getNames(appId?: number): Observable<any> {
    const params = new HttpParams();
    if (typeof (appId) === 'undefined') {
      appId = 0;
    }
    return this.http
      .get(`/api/v1/apps/${appId}/configmaps/names`, {params: params})

      .catch(error => throwError(error));
  }

  list(pageState: PageState, deleted?: string, appId?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('deleted', deleted);
    params = params.set('relate', 'all');
    params = params.set('sortby', '-id');
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
    if (Object.keys(pageState.sort).length !== 0 && pageState.sort.by !== 'app.name') {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = '0';
    }
    return this.http
      .get(`/api/v1/apps/${appId}/configmaps`, {params: params})

      .catch(error => throwError(error));
  }

  create(configMap: ConfigMap): Observable<any> {
    return this.http
      .post(`/api/v1/apps/${configMap.appId}/configmaps`, configMap, this.options)

      .catch(error => throwError(error));
  }

  update(configMap: ConfigMap): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${configMap.appId}/configmaps/${configMap.id}`, configMap, this.options)

      .catch(error => throwError(error));
  }

  updateOrder(appId: number, orderList: Array<OrderItem>): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${appId}/configmaps/updateorders`, orderList, this.options)

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
      .delete(`/api/v1/apps/${appId}/configmaps/${id}`, options)

      .catch(error => throwError(error));
  }

  getById(id: number, appId: number): Observable<any> {
    return this.http
      .get(`/api/v1/apps/${appId}/configmaps/${id}`)

      .catch(error => throwError(error));
  }
}
