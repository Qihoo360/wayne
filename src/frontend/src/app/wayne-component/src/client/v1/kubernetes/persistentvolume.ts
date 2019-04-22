import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { PersistentVolume } from '../../../model/v1/kubernetes/persistentvolume';
import { throwError } from 'rxjs';

@Injectable()
export class PersistentVolumeClient {
  constructor(private http: HttpClient) {
  }

  list(cluster: string): Observable<any> {
    return this.http
      .get(`/api/v1/kubernetes/persistentvolumes/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  create(pv: PersistentVolume, cluster: string): Observable<any> {
    return this.http
      .post(`/api/v1/kubernetes/persistentvolumes/clusters/${cluster}`, pv)
      .catch(error => throwError(error));
  }

  update(pv: PersistentVolume, cluster: string): Observable<any> {
    return this.http
      .put(`/api/v1/kubernetes/persistentvolumes/${pv.metadata.name}/clusters/${cluster}`, pv)
      .catch(error => throwError(error));
  }

  deleteById(name: string, cluster: string): Observable<any> {
    return this.http
      .delete(`/api/v1/kubernetes/persistentvolumes/${name}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

  getById(name: number, cluster: string): Observable<any> {
    return this.http.get(`/api/v1/kubernetes/persistentvolumes/${name}/clusters/${cluster}`)
      .catch(error => throwError(error));
  }

}
