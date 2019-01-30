import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class AuthoriseService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  Login(username: string, password: string, type: string): Observable<any> {
    const encodedName = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    return this.http
      .post(`/login/${type}?username=${encodedName}&password=${encodedPassword}`, null, this.options)
      .catch(error => throwError(error));
  }
}
