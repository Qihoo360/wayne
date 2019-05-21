import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class NamespaceClient {
  constructor(private http: HttpClient) {
  }

  create(name: string, cluster: string): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/namespaces/${name}/clusters/${cluster}`, {})
      .catch(error => throwError(error));
  }


  getResourceUsage(namespaceId: number, appName?: string): Observable<any> {
    let params = new HttpParams();
    if (appName) {
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/kubernetes/namespaces/${namespaceId}/resources`, {params: params})
      .catch(error => throwError(error));
  }

  getResource(namespaceId: number, appName?: string): Observable<any> {
    let params = new HttpParams();
    if (appName) {
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/kubernetes/namespaces/${namespaceId}/statistics`, {params: params})
      .catch(error => throwError(error));
  }
}
