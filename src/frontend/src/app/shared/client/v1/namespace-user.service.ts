import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { NamespaceUser } from '../../model/v1/namespace-user';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';

@Injectable()
export class NamespaceUserService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  list(pageState: PageState, listType: string, resourceId: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('relate', 'all');
    let namespaceId = 0;
    switch (listType) {
      case 'user':
        params = params.set('userId', resourceId + '');
        break;
      case 'namespace':
        params = params.set('namespaceId', resourceId + '');
        namespaceId = parseInt(resourceId);
        break;
    }
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
      let sortType: any;
      switch (pageState.sort.by) {
        case 'user.name':
          sortType = pageState.sort.reverse ? '-user' : 'user';
          params = params.set('sortby', sortType);
          break;
        default:
          sortType = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
          params = params.set('sortby', sortType);
      }
    }

    return this.http.get(`/api/v1/namespaces/${namespaceId}/users`, {params: params})

      .catch(error => Observable.throw(error));
  }

  create(namespaceUser: NamespaceUser): Observable<any> {
    return this.http.post(`/api/v1/namespaces/${namespaceUser.namespace.id}/users`, namespaceUser, this.options)

      .catch(error => Observable.throw(error));
  }

  update(namespaceUser: NamespaceUser): Observable<any> {
    return this.http.put(`/api/v1/namespaces/${namespaceUser.namespace.id}/users/${namespaceUser.id}`, namespaceUser, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteById(id: number, namespaceId: number): Observable<any> {
    let options: any = {};
    return this.http.delete(`/api/v1/namespaces/${namespaceId}/users/${id}`, options)

      .catch(error => Observable.throw(error));
  }

  getById(id: number, namespaceId: string): Observable<any> {
    return this.http.get(`/api/v1/namespaces/${namespaceId}/users/${id}`)

      .catch(error => Observable.throw(error));
  }
}
