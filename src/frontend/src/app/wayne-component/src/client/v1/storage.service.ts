import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() {
  }

  _toString(value: any) {
    if (typeof value === 'undefined' || Object.prototype.toString.call(value) === '[object Null]') {
      return false;
    }
    if (typeof value === 'string') {
      return value;
    } else if (typeof value !== 'object') {
      return value.toString();
    } else {
      return JSON.stringify(value);
    }
  }

  save(k: any, v: any) {
    const key = this._toString(k);
    const value = this._toString(v);
    if (!(key && value)) { return; }
    if (window.localStorage) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        this.setCookie(key, value);
      }
    } else {
      this.setCookie(key, value);
    }
  }

  get(k: any) {
    const key = this._toString(k);
    if (!key) { return; }
    if (window.localStorage) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return this.getCookie(key);
      }
    } else {
      return this.getCookie(key);
    }
  }

  setCookie(key: string, value: string, day?: number) {
    if (day === undefined) {
      day = 100;
    }
    const exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${value};expires=${exp.toUTCString()}`;
  }

  getCookie(key: string) {
    const arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
    if (arr !== null) { return arr[2]; }
    return null;
  }

}
