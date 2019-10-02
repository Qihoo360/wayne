import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

const defaultInterval = 1000;
const defaultLeftTime = 1;

@Component({
  selector: 'unauthorized',
  templateUrl: 'unauthorized.component.html',
  styleUrls: ['unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit, OnDestroy {
  leftSeconds: number = defaultLeftTime;
  timeInterval: any = null;

  constructor(private router: Router,
              @Inject(DOCUMENT) private document: any) {
  }

  ngOnInit(): void {
    if (!this.timeInterval) {
      this.timeInterval = setInterval(interval => {
        this.leftSeconds--;
        if (this.leftSeconds <= 0) {
          // 未授权重定向到登录页面
          // document.location.href
          const currentUrl = this.document.location.origin;
          setTimeout(() => {
            this.document.location.href = `${currentUrl}/sign-in`;
          }, defaultLeftTime);
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
