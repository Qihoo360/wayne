import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class JobClient {
  constructor(private http: HttpClient) {
  }

  listAllClusterByCronjobName(appId: number, namespace: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/listAllClusterByCronjob/${cronjobName}/namespaces/${namespace}`)
      .catch(error => Observable.throw(error));
  }

  listByCronjobName(appId: number, cluster: string, namespace: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/listByCronjob/${cronjobName}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  PodsEvent(appId: number, cluster: string, namespace: string, jobName: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/getPodsEvent/${jobName}/${cronjobName}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }
}
