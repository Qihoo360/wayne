import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class LogClient {
  constructor(private http: HttpClient) {
  }

  get(appId: number, cluster: string, namespace: string, pod: string, container: string, tailLines: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('tailLines', tailLines + '');
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/podlogs/${pod}/containers/${container}/
      namespaces/${namespace}/clusters/${cluster}`, {params: params})
      .catch(error => Observable.throw(error));
  }
}
