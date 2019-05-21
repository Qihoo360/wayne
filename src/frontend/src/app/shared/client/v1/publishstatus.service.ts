import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';

@Injectable()
export class PublishStatusService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  listStatus(type?: number, resourceId?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('type', type + '');
    params = params.set('resourceId', resourceId + '');
    return this.http
      .get('/api/v1/publishstatus', {params: params})

      .catch(error => throwError(error));
  }

  deleteById(id: number): Observable<any> {
    return this.http
      .delete(`/api/v1/publishstatus/${id}`)

      .catch(error => throwError(error));
  }

}
