import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class ModalService {
  modalObservable = new Subject<any>();

  modalObservable$ = this.modalObservable.asObservable();

  open() {
    this.modalObservable.next({method: 'open'});
  }
  cancel() {
    this.modalObservable.next({method: 'cancel'});
  }
  comfirm() {
    this.modalObservable.next({method: 'confirm'});
  }
}
