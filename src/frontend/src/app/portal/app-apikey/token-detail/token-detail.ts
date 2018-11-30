import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'token-detail',
  templateUrl: 'token-detail.component.html',
})
export class TokenDetailComponent {
  token: string;
  modalOpened: boolean;

  constructor(
    public translate: TranslateService
  ) {
  }

  viewToken(token: string) {
    this.modalOpened = true;
    this.token = token;
  }




}
