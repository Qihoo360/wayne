import { Component, OnDestroy, OnInit } from '@angular/core';
import { TplDetailService } from './tpl-detail.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tpl-detail',
  templateUrl: 'tpl-detail.component.html',
  styleUrls: ['tpl-detail.scss']
})

export class TplDetailComponent implements OnInit, OnDestroy {
  modalOpened: boolean;
  text: string;
  title = 'release_explain';
  textSub: Subscription;

  constructor(private tplDetailService: TplDetailService) {
  }

  openModal(text: string) {
    this.text = text;
    this.modalOpened = true;
  }


  ngOnInit(): void {
    this.textSub = this.tplDetailService.text$.subscribe(
      msg => {
        this.modalOpened = true;
        this.text = msg.text;
        if (msg.title) { this.title = msg.title; }
      }
    );
  }

  ngOnDestroy() {
    if (this.textSub) {
      this.textSub.unsubscribe();
    }
  }
}


