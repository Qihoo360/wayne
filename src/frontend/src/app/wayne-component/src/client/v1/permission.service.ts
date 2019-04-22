import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Permission } from '../../model/v1/permission';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { throwError } from 'rxjs';

@Injectable()
export class PermissionService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listPermission(pageState: PageState): Observable<any> {
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
    if (Object.keys(pageState.sort).length !== 0) {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/permissions', {params: params})

      .catch(error => throwError(error));
  }

  createPermission(permission: Permission): Observable<any> {
    return this.http
      .post(`/api/v1/permissions`, permission, this.options)

      .catch(error => throwError(error));
  }

  updatePermission(permission: Permission): Observable<any> {
    return this.http
      .put(`/api/v1/permissions/${permission.id}`, permission, this.options)

      .catch(error => throwError(error));
  }

  deletePermission(permissionId: number): Observable<any> {
    const options: any = {};
    return this.http
      .delete(`/api/v1/permissions/${permissionId}`, options)

      .catch(error => throwError(error));
  }

  getPermission(permissionId: number): Observable<any> {
    return this.http
      .get(`/api/v1/permissions/${permissionId}`)

      .catch(error => throwError(error));
  }

  initDict(): Observable<any> {
    return this.http
      .get(`/api/v1/permissions/init`)

      .catch(error => throwError(error));
  }
}
