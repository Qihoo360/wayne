import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AvailablePort } from '../../model/v1/available-port';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class AvailablePortService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  getLvs(): Observable<any> {
    return this.http
      .get(`/api/v1/services/availableports/lvs`)

      .catch(error => throwError(error));
  }

  list(pageState: PageState): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
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
    if (Object.keys(pageState.sort).length !== 0) {
      const sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/services/availableports', {params: params})

      .catch(error => throwError(error));
  }

  create(availablePort: AvailablePort): Observable<any> {
    return this.http
      .post(`/api/v1/services/availableports`, availablePort, this.options)

      .catch(error => throwError(error));
  }

  update(availablePort: AvailablePort): Observable<any> {
    return this.http
      .put(`/api/v1/services/availableports/${availablePort.id}`, availablePort, this.options)

      .catch(error => throwError(error));
  }

  deleteById(id: number): Observable<any> {
    return this.http
      .delete(`/api/v1/services/availableports/${id}`)

      .catch(error => throwError(error));
  }

  getById(id: number): Observable<any> {
    return this.http
      .get(`/api/v1/services/availableports/${id}`)

      .catch(error => throwError(error));
  }

  getByPort(port: number): Observable<any> {
    return this.http
      .get(`/api/v1/services/availableports/port/${port}`)

      .catch(error => throwError(error));
  }

}
