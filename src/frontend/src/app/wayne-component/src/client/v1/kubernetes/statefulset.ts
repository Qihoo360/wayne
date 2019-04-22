import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class StatefulsetClient {
  constructor(private http: HttpClient) {
  }

  deploy(appId: number, cluster: string, resourceId: number, tplId: number, template: any): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/apps/${appId}/statefulsets/${resourceId}/tpls/${tplId}/clusters/${cluster}`, template)
      .catch(error => throwError(error));
  }

  get(appId: number, cluster: string, namespace: string, name: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/statefulsets/${name}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }
}
