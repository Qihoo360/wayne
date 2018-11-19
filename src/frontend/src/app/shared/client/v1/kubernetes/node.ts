import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {KubeNode} from '../../../model/v1/kubernetes/node';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class NodeClient {
  constructor(private http: HttpClient) {
  }
  getStatistics(): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/nodes/statistics`)
      .catch(error => Observable.throw(error))
  }

  list(cluster: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/nodes/clusters/${cluster}`)
      .catch(error => Observable.throw(error))
  }

  update(node: KubeNode, cluster: string): Observable<any> {
    return this.http
      .put(`/api/v1/kubernetes/nodes/${node.metadata.name}/clusters/${cluster}`, node)
      .catch(error => Observable.throw(error));
  }

  deleteByName(name: string, cluster: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/nodes/${name}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }

  getByName(name: string, cluster: string): Observable<any> {
    return this.http.get(`/api/v1/kubernetes/nodes/${name}/clusters/${cluster}`)
      .catch(error => Observable.throw(error));
  }
}
