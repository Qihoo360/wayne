import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class AuditLogService {
  constructor(private http: HttpClient) {
  }

  listPage(pageState: PageState): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      const value = pageState.filters[key];
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
      .get('/api/v1/auditlogs', {params: params})

      .catch(error => throwError(error));
  }
}
