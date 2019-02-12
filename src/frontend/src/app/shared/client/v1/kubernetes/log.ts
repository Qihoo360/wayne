import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class LogClient {
  constructor(private http: HttpClient) {
  }

  get(appId: number, cluster: string, namespace: string, pod: string, container: string, tailLines: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('tailLines', tailLines + '');
    const url = `/api/v1/kubernetes/apps/${appId}/podlogs/${pod}/containers/${container}/namespaces/${namespace}/clusters/${cluster}`;
    return this.http
      .get(url, {params: params})
      .catch(error => throwError(error));
  }
}
