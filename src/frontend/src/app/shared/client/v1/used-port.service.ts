import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {PageState} from '../../page/page-state';
import {isNotEmpty} from '../../utils';

@Injectable()
export class UsedPortService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  list(pageState: PageState): Observable<any> {
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
          filterList.push(`${key}=${value}`)
        } else {
          filterList.push(`${key}__contains=${value}`);
        }
      }
    })
    if (filterList.length) {
      params = params.set('filter', filterList.join(','));
    }
    // sort param
    if (Object.keys(pageState.sort).length !== 0 && pageState.sort.by !== 'service.name') {
      let sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/services/usedports', {params: params})

      .catch(error => Observable.throw(error))
  }

  deleteById(id: number, logical?: boolean): Observable<any> {
    let options : any = {};
    if (logical != null) {
      let params = new HttpParams();
      params = params.set('logical', logical + '');
      options.params = params
    }

    return this.http
      .delete(`/api/v1/services/usedports/${id}`, options)

      .catch(error => Observable.throw(error));
  }

  deleteByServiceId(serviceId: number): Observable<any> {
    let options : any = {};
    let params = new HttpParams();
    params = params.set('serviceId', serviceId + '');
    options.params = params;
    return this.http
      .delete(`/api/v1/services/usedports`, options)

      .catch(error => Observable.throw(error));
  }

  getById(id: number): Observable<any> {
    return this.http
      .get(`/api/v1/services/usedports/${id}`)

      .catch(error => Observable.throw(error));
  }

}
