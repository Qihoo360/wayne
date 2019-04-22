import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AppStarred } from '../../model/v1/app-starred';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AppStarredService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  create(app: AppStarred): Observable<any> {
    return this.http
      .post(`/api/v1/apps/stars`, app, this.options)

      .catch(error => throwError(error));
  }

  deleteByAppId(appId: number): Observable<any> {
    return this.http
      .delete(`/api/v1/apps/stars/${appId}`)

      .catch(error => throwError(error));
  }

}
