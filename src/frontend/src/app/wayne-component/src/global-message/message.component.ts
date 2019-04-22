import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/common';
import { Message } from './message';
import { MessageService } from './message.service';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { ScrollBarService } from '../client/v1/scrollBar.service';

@Component({
  selector: 'global-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('showState', [
      state('show', style({
        left: '0px'
      })),
      state('hide', style({
        left: '350px',
        height: '0px',
        padding: '0px',
        border: 'none',
        marginBottom: '0px'
      })),
      transition('* => show', animate('200ms cubic-bezier(.73,.18,.88,.6)')),
      transition('show => hide', [
        group([
          animate('200ms cubic-bezier(.18,.73,.6,.88)', style({
            left: '350px'
          })),
          animate('100ms 200ms cubic-bezier(0,0,1,1)', style({
            height: '0px',
            padding: '0px',
            border: 'none',
            marginBottom: '0px'
          }))
        ])
      ])
    ])
  ]
})
export class MessageComponent implements OnInit, OnDestroy {

  infoList: Message[] = [];
  timer: object = new Object();
  msgSub: Subscription;
  clearSub: Subscription;
  // box的位置
  posiRight = 18;

  delayTime = 5000;

  constructor(
    private element: ElementRef,
    private messageService: MessageService,
    private scrollBar: ScrollBarService,
    private render: Renderer2,
    @Inject(DOCUMENT) private document: HTMLElement
  ) {
  }

  ngOnInit(): void {
    this.msgSub = this.messageService.messageAnnounced$.subscribe(
      message => {
        const index = this.infoList.length;
        message.state = 'show';
        setTimeout(() => {
          this.posiChange();
        }, 0);
        this.infoList.push(message);
        this.timer[index] = setTimeout(() => {
          this.close(index);
        }, this.delayTime);
      }
    );

    this.clearSub = this.messageService.clearChan$.subscribe(clear => {
      this.onClose();
    });
  }

  posiChange() {
    try {
      const box = this.document.querySelector('.content-area');
      this.posiRight = box.scrollHeight - box.clientHeight > 0 ? 18 + this.scrollBar.scrollBarWidth : 18;
    } catch (error) {
      this.posiRight = 18;
    }
  }

  ngOnDestroy() {
    if (this.msgSub) {
      this.msgSub.unsubscribe();
    }

    if (this.clearSub) {
      this.clearSub.unsubscribe();
    }
  }

  get availListLength() {
    return this.infoList.filter(item => item.state === 'show').length;
  }


  enterEvent(index: number) {
    this.infoList[index].keep = true;
    clearTimeout(this.timer[index]);
  }

  leaveEvent(index: number) {
    if (this.infoList[index].keep) {
      this.infoList[index].keep = false;
      this.timer[index] = setTimeout(() => {
        this.close(index);
      }, this.delayTime);
    }
  }

  closeEvent(index: number) {
    this.infoList[index].keep = false;
    clearTimeout(this.timer[index]);
    this.close(index);
  }

  close(index: number) {
    if (!this.infoList[index].keep) {
      this.infoList[index].state = 'hide';
      // 没有显示，清楚数据
      if (this.availListLength === 0) {
        setTimeout(() => {
          if (this.availListLength === 0) {
            this.infoList = [];
            this.timer = {};
          }
        }, this.delayTime);
      }
    }
  }

  onClose() {
    this.infoList = [];
    Object.keys(this.timer).forEach(item => {
      clearTimeout(this.timer[item]);
    });
    this.timer = {};
  }
}
