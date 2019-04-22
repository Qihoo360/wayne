import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultRoutingUrl } from '../shared.const';

const defaultInterval = 1000;
const defaultLeftTime = 3;

@Component({
  selector: 'page-not-found',
  templateUrl: 'not-found.component.html',
  styleUrls: ['not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  leftSeconds: number = defaultLeftTime;
  timeInterval: any = null;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (!this.timeInterval) {
      this.timeInterval = setInterval(interval => {
        this.leftSeconds--;
        if (this.leftSeconds <= 0) {
          this.router.navigate([defaultRoutingUrl]);
          clearInterval(this.timeInterval);
        }
      }, defaultInterval);
    }
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
