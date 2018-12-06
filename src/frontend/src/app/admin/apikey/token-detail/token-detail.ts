import { Component } from '@angular/core';

@Component({
  selector: 'token-detail',
  templateUrl: 'token-detail.component.html',
})
export class TokenDetailComponent {
  token: string;
  modalOpened: boolean;

  constructor() {
  }

  viewToken(token: string) {
    this.modalOpened = true;
    this.token = token;
  }




}
