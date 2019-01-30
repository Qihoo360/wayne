import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PageState } from '../../page/page-state';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notification } from '../../model/v1/notification';
import { throwError } from 'rxjs';

@Injectable()
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  query(pageState: PageState): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
    return this.http
      .get(`/api/v1/notifications`, {params: params})
      //
      .catch(error => throwError(error));
  }

  publish(id): Observable<any> {
    return this.http
      .put(`/api/v1/notifications?id=` + id, {})

      .catch(error => throwError(error));
  }

  subscribe(pageState: PageState): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
    // params = params.set('is_readed', pageState.params['is_readed'])
    return this.http
      .get(`/api/v1/notifications/subscribe`, {params: params})

      .catch(error => throwError(error));
  }

  read(id): Observable<any> {
    return this.http
      .put(`/api/v1/notifications/subscribe?id=` + id, {})

      .catch(error => throwError(error));
  }

  create(notify: Notification): Observable<any> {
    return this.http
      .post(`/api/v1/notifications`, notify)

      .catch(error => throwError(error));
  }

}
