import { AfterViewInit, Component, ContentChildren, ElementRef, Inject, OnDestroy, QueryList } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventManager } from '@angular/platform-browser';
import { ListStyle } from './ListStyle';
import { TabComponent } from './tab/tab.component';
import { TabDragService } from '../client/v1/tab-drag.service';
import { StorageService } from '../client/v1/storage.service';

@Component({
  selector: 'wayne-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterViewInit, OnDestroy {
  // margin 指的是tabs-box-inner的margin值。
  margin = 40;
  listStyle: ListStyle = new ListStyle();
  showViewPager = false;
  showFoldIcon = false;
  tabsContent: HTMLElement;
  tabsList: HTMLElement;
  tabsContentWidth: number;
  tabsListWidth: number;
  firstEnter = true;
  resizeTimer: any;
  prevDisabled = true;
  nextDisabled = false;
  dragSubscribe: Array<any> = new Array();
  eventList: Array<Function> = new Array();
  clickList: Array<Function> = new Array();
  _searchContent: string;
  _tabs: QueryList<any>;
  allowShowAll = false;

  constructor(
    private el: ElementRef,
    private eventManager: EventManager,
    private dragService: TabDragService,
    private storage: StorageService,
    @Inject(DOCUMENT) private document: HTMLElement
  ) {
    this.dragSubscribe.push(
      this.dragService.controlTransObservable.subscribe(
        direction => {
          if (direction === 'right') {
            if (this.listStyle.translateX > (this.tabsContentWidth - this.tabsListWidth)) {
              this.listStyle.translateX = this.listStyle.translateX < (this.tabsContentWidth - this.tabsListWidth + 10) ?
                this.tabsContentWidth - this.tabsListWidth : this.listStyle.translateX - 10;
            }
          } else if (direction === 'left') {
            if (this.listStyle.translateX < 0) {
              this.listStyle.translateX = this.listStyle.translateX > -10 ? 0 : this.listStyle.translateX + 10;
            }
          }
        }
      )
    );
  }

  get tabsNum(): number {
    return this._tabs.length;
  }

  get searchContent() {
    return this._searchContent;
  }

  set searchContent(value: string) {
    if (value !== this._searchContent) {
      this._searchContent = value;
      this.filtertabs();
    }
  }
  // card
  resetCardState() {
    if (this.allowShowAll) {
      this.showViewPager = false;
      this.resetFoldState(true);
    } else {
      this.allowShowAll = false;
      setTimeout(() => {
        if (this.tabsContent.clientWidth < this.tabsList.scrollWidth) {
          this.showViewPager = true;
        }
      });
      this.resetFoldState(false);
    }
    this.tabsList.style.transition = 'none';
    this.listStyle.translateX = 0;
    // 触发改变
    setTimeout(() => {
      this.tabsList.style.transition = 'all .3s ease-in-out';
    }, 200);
  }
  changeCard() {
    this.allowShowAll = !this.allowShowAll;
    this.resetCardState();
  }
  setFoldState() {
    const fold = this.storage.get('tab-fold');
    if (fold === 'yes') {
      this.allowShowAll = true;
    } else {
      this.allowShowAll = false;
    }
    this.resetCardState();
  }
  resetFoldState(state: boolean) {
    this.storage.save('tab-fold', state ? 'yes' : 'no');
  }
  judgeFoldShow() {
    if (this.allowShowAll) {
      if (this.tabsContent.clientHeight > 40) {
        this.showFoldIcon = true;
      } else {
        this.showFoldIcon = false;
      }
    } else {
      this.showFoldIcon = this.tabsContentWidth < this.tabsListWidth ? true : false;
    }
  }

  filtertabs() {
    this._tabs.forEach(item => {
      const el = item.el.nativeElement;
      el.classList.remove('hide');
      if (el.innerText.indexOf(this.searchContent) === -1) {
        el.classList.add('hide');
      }
      this.boxResize();
    });
  }

  ngOnDestroy() {
    this.dragSubscribe.forEach(subscribe => {
      subscribe.unsubscribe();
    });
    this.removeClickEvent();
    this.eventList.forEach(event => {
      event();
    });
    this.dragService.over();
  }

  @ContentChildren(TabComponent) set tabs(tabs: QueryList<any>) {
    this._tabs = tabs;
    this.removeClickEvent();
    this.addClickEvent(tabs);
    this.setActive(tabs);
    if (!this.firstEnter) { this.boxResize(); }
    this.firstEnter = false;
    setTimeout(() => {
      this.setFoldState();
    });
  }

  prevEnter() {
    if (this.listStyle.translateX) {
      this.prevDisabled = false;
    } else {
      this.prevDisabled = true;
    }
  }

  prevLeave() {
    this.prevDisabled = false;
  }

  nextEnter() {
    if (this.tabsList.scrollWidth + this.listStyle.translateX <= this.tabsContent.clientWidth) {
      this.nextDisabled = true;
    } else {
      this.nextDisabled = false;
    }
  }

  nextLeave() {
    this.nextDisabled = false;
  }

  get listTransform() {
    return this.listStyle.translateX ? `translateX(${this.listStyle.translateX}px)` : '';
  }

  removeClickEvent() {
    this.clickList.forEach(func => {
      func();
    });
  }

  addClickEvent(tmpList: QueryList<any>) {
    tmpList.forEach((template, index) => {
      this.clickList.push(
        this.eventManager.addEventListener(template.el.nativeElement, 'click', this.setActive.bind(this, tmpList))
      );
    });
  }

  setActive(tmpList: QueryList<any>) {
    let existActive = false;
    tmpList.forEach((template, index) => {
      if (template.active) {
        existActive = true;
        const activeItem = template.el.nativeElement.querySelector('.tabs-item');
        activeItem.classList.add('active');
      } else {
        template.el.nativeElement.querySelector('.tabs-item').classList.remove('active');
      }
    });
  }

  ngAfterViewInit() {
    this.tabsContent = this.el.nativeElement.querySelector('.tabs-content');
    this.tabsList = this.el.nativeElement.querySelector('.tabs-list');
    this.tabsContentWidth = this.tabsContent.clientWidth;
    this.tabsListWidth = this.tabsList.scrollWidth;
    if (this.tabsContentWidth < this.tabsListWidth) {
      this.showViewPager = true;
      this.tabsContentWidth -= 2 * this.margin;
    }
    this.judgeFoldShow();
    if (typeof window !== 'undefined') { window.onresize = this.boxResize.bind(this); }
    this.dragService.init(this.el.nativeElement);
    this.eventList.push(
      this.eventManager.addEventListener(this.document.querySelector('.nav-trigger'), 'click', this.boxResize.bind(this, true))
    );
  }

  prev() {
    const currentWidth = this.tabsListWidth + this.listStyle.translateX;
    if (Math.abs(this.listStyle.translateX) < this.tabsContentWidth) {
      this.listStyle.translateX = 0;
    } else {
      this.listStyle.translateX += this.tabsContentWidth;
    }
    this.prevEnter();
  }

  next() {
    this.tabsListWidth = this.tabsList.scrollWidth;
    const currentWidth = this.tabsListWidth + this.listStyle.translateX;
    // 这里不用缓冲是为了解决在tab切换时候出现滚动条会遮挡最后一个tab的情况。
    this.tabsContentWidth = this.tabsContent.clientWidth;
    if (currentWidth <= this.tabsContentWidth) {
      return;
    } else if (currentWidth > this.tabsContentWidth && currentWidth < 2 * this.tabsContentWidth) {
      this.listStyle.translateX += -(currentWidth - this.tabsContentWidth);
    } else {
      this.listStyle.translateX += -this.tabsContentWidth;
    }
    this.nextEnter();
  }


  boxResize(slow?: boolean) {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.tabsContentWidth = this.tabsContent.clientWidth;
      this.tabsListWidth = this.tabsList.scrollWidth;
      if (!this.showViewPager && this.tabsContentWidth < this.tabsListWidth) {
        this.showViewPager = true;
        this.tabsContentWidth -= 2 * this.margin;
      } else if (this.showViewPager) {
        if (this.tabsContentWidth + 2 * this.margin >= this.tabsListWidth) {
          this.listStyle.translateX = 0;
          this.showViewPager = false;
          this.tabsContentWidth += 2 * this.margin;
        } else if (this.listStyle.translateX + this.tabsListWidth <= this.tabsContentWidth) {
          this.listStyle.translateX = this.tabsContentWidth - this.tabsListWidth;
        }
      }
      this.judgeFoldShow();
      this.resetCardState();
    }, slow ? 200 : 1000 / 60);
  }
}
