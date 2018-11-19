import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class NamespaceClient {
  constructor(private http: HttpClient) {
  }

  getResourceUsage(namespaceId: number, appName?: string): Observable<any> {
    let params = new HttpParams();
    if (appName){
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/kubernetes/namespaces/${namespaceId}/resources`, {params: params})
      .catch(error => Observable.throw(error))
  }
  getResource(namespaceId:number,appName?:string): Observable<any> {
    let params = new HttpParams();
    if (appName){
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/kubernetes/namespaces/${namespaceId}/statistics`, {params: params})
      .catch(error => Observable.throw(error))
  }
  getHistory(namespaceId:number,appName?:string): Observable<any> {
    let params = new HttpParams();
    if (appName){
      params = params.set('app', appName);
    }
    return this.http
      .get(`/api/v1/namespaces/${namespaceId}/history`, {params: params})
      .catch(error => Observable.throw(error))
  }
}
