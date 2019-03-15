import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { User } from '../model/v1/user';
import { TypePermission } from '../model/v1/permission';
import { CacheService } from './cache.service';
import { MessageHandlerService } from '../message-handler/message-handler.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  currentUser: User = null;
  config: any;
  currentNamespacePermission: TypePermission = null;
  currentAppPermission: TypePermission = null;

  constructor(private http: HttpClient,
              private messageHandlerService: MessageHandlerService,
              public cacheService: CacheService) {
    this.currentAppPermission = new TypePermission();
    this.currentNamespacePermission = new TypePermission();
  }

  initConfig(): Promise<any> {
    return this.http
      .get(`/api/v1/configs/base`)
      .toPromise().then((response: any) => {
          this.config = response.data;
          return response.data;
        }
      ).catch(error =>
        this.handleError(error));
  }

  retrieveUser(): Promise<User> {
    return this.http.get(`/currentuser`).toPromise().then((response: any) => {
      this.currentUser = response.data;
      this.cacheService.setNamespaces(this.currentUser.namespaces);
      return response.data;
    }).catch(error => {
      this.messageHandlerService.handleError(error);
      return Promise.resolve();
    });
  }

  setNamespacePermissionById(id: number) {
    return this.http.get(`/api/v1/namespaces/${id}/users/permissions/${id}`).toPromise().then((response: any) => {
      this.currentNamespacePermission = response.data;
    }).catch(error => this.handleError(error));
  }

  setAppPermissionById(id: number) {
    return this.http.get(`/api/v1/apps/${id}/users/permissions/${id}`).toPromise().then((response: any) => {
      this.currentAppPermission = response.data;
    }).catch(error => this.handleError(error));
  }

  // Handle the related exceptions
  handleError(error: any): Promise<any> {
    // messageHandlerService
    return Promise.reject(error);
  }

}
