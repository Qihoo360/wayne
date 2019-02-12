import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { PersistentVolumeClaimTpl } from '../../model/v1/persistentvolumeclaimtpl';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { throwError } from 'rxjs';

@Injectable()
export class PersistentVolumeClaimTplService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  private isOnlineController = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  isOnlineObservable$ = this.isOnlineController.asObservable();

  public isOnlineChange(isOnline: boolean) {
    this.isOnlineController.next(isOnline);
  }




  list(pageState: PageState, appId?: number, deleted?: string, pvcId?: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('deleted', deleted);
    params = params.set('sortby', '-id');
    if (pvcId) {
      params = params.set('pvcId', pvcId);
    }
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
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = 0;
    }

    return this.http
      .get(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls`, {params: params})

      .catch(error => throwError(error));
  }

  listPage(pageState: PageState, appId: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
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
    if ((typeof (appId) === 'undefined') || (!appId)) {
      appId = 0;
    }

    return this.http
      .get(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls`, {params: params})

      .catch(error => throwError(error));
  }

  create(pvcTpl: PersistentVolumeClaimTpl, appId: number): Observable<any> {
    return this.http
      .post(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls`, pvcTpl, this.options)

      .catch(error => throwError(error));
  }

  update(pvcTpl: PersistentVolumeClaimTpl, appId: number): Observable<any> {
    return this.http
      .put(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls/${pvcTpl.id}`, pvcTpl, this.options)

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
      .delete(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls/${id}`, options)

      .catch(error => throwError(error));
  }

  getById(id: number, appId: number): Observable<any> {
    return this.http
      .get(`/api/v1/apps/${appId}/persistentvolumeclaims/tpls/${id}`)

      .catch(error => throwError(error));
  }
}
