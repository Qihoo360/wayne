import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AppUser } from '../../model/v1/app-user';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class AppUserService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  list(pageState: PageState, listType: string, resourceId: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('relate', 'all');
    let appId = 0;
    switch (listType) {
      case 'user':
        params = params.set('userId', resourceId + '');
        break;
      case 'app':
        params = params.set('appId', resourceId + '');
        appId = parseInt(resourceId, 10);
        break;
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

    if (Object.keys(pageState.sort).length !== 0 && pageState.sort.by !== 'app.name' && pageState.sort.by !== 'user.name') {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http.get(`/api/v1/apps/${appId}/users`, {params: params})

      .catch(error => throwError(error));
  }

  create(appUser: AppUser): Observable<any> {
    return this.http.post(`/api/v1/apps/${appUser.app.id}/users`, appUser, this.options)

      .catch(error => throwError(error));
  }

  update(appUser: AppUser): Observable<any> {
    return this.http.put(`/api/v1/apps/${appUser.app.id}/users/${appUser.id}`, appUser, this.options)

      .catch(error => throwError(error));
  }

  deleteById(id: number, appId: number): Observable<any> {
    const options: any = {};
    return this.http.delete(`/api/v1/apps/${appId}/users/${id}`, options)

      .catch(error => throwError(error));
  }

  getById(id: number, appId: number): Observable<any> {
    return this.http.get(`/api/v1/apps/${appId}/users/${id}`)

      .catch(error => throwError(error));
  }
}
