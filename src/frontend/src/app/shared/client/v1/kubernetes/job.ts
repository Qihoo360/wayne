import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class JobClient {
  constructor(private http: HttpClient) {
  }

  listAllClusterByCronjobName(appId: number, namespace: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/listAllClusterByCronjob/${cronjobName}/namespaces/${namespace}`)
      .catch(error => throwError(error));
  }

  listByCronjobName(appId: number, cluster: string, namespace: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/listByCronjob/${cronjobName}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  PodsEvent(appId: number, cluster: string, namespace: string, jobName: string, cronjobName: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/apps/${appId}/jobs/getPodsEvent/${jobName}/${cronjobName}/namespaces/${namespace}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }
}
