import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { User } from '../../model/v1/user';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listUser(pageState: PageState): Observable<any> {
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
      .get('/api/v1/users', {params: params})

      .catch(error => throwError(error));
  }

  createUser(user: User): Observable<any> {
    return this.http
      .post(`/api/v1/users`, user, this.options)

      .catch(error => throwError(error));
  }

  getNames(): Observable<any> {
    return this.http.get('/api/v1/users/names')

      .catch(error => throwError(error));
  }

  updateUser(user: User): Observable<any> {
    return this.http
      .put(`/api/v1/users/${user.id}`, user, this.options)

      .catch(error => throwError(error));
  }

  updateUserAdmin(user: User): Observable<any> {
    return this.http
      .put(`/api/v1/users/${user.id}/admin`, user, this.options)

      .catch(error => throwError(error));
  }

  resetPassword(user: User): Observable<any> {
    return this.http
      .put(`/api/v1/users/${user.id}/resetpassword`, user, this.options)

      .catch(error => throwError(error));
  }

  deleteUser(userId: number): Observable<any> {
    const options: any = {};
    return this.http
      .delete(`/api/v1/users/${userId}`, options)

      .catch(error => throwError(error));
  }

  getUser(userId: number): Observable<any> {
    return this.http
      .get(`/api/v1/users/${userId}`)

      .catch(error => throwError(error));
  }

  getStatistics(): Observable<any> {
    return this.http
      .get('/api/v1/users/statistics')

      .catch(error => throwError(error));
  }

}
