import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NodeOffset } from './nodeOffset';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'wayne-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {

  nodeTree: Array<any>;
  private box: any;
  boxHeight = 0;
  boxOffset: number;
  allNodeOffset: Array<NodeOffset>;
  // 判断是否在点击跳转中，避开scrollEvent 事件
  jumpTo = 0;
  scrollEventManage: any;

  /**
   * 这里监听不到数组的变化，只能采用传递字符创方式。。。
   */
  @Input()
  set node(value: string) {
    if (value) {
      this.nodeTree = this.resolveTree(JSON.parse(value));
      this.boxInit();
      this.scrollEvent();
      this.addJumpEvent();
    }
  }

  @Input()
  set container(value: string) {
    if (value) {
      if (this.scrollEventManage) { this.scrollEventManage(); }
      if (this.document.querySelector(value)) {
        this.box = this.document.querySelector(value);
        this.scrollEventManage = this.eventMessage.addEventListener(this.box, 'scroll', this.scrollEvent.bind(this));
      } else {
        console.error('container不存在');
      }
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventMessage: EventManager
  ) {
  }

  ngAfterViewInit() {
    this.boxInit();
    this.scrollEvent();
  }

  ngOnDestroy() {
    if (this.scrollEventManage) { this.scrollEventManage(); }
  }

  boxInit() {
    if (this.box) {
      this.boxHeight = this.getBoxHeight(this.box);
      this.boxOffset = this.getOffset(this.box);
      if (this.nodeTree) { this.allNodeOffset = this.getBoxOffset(); }
    }
  }

  getElement(idName: string): HTMLElement | null {
    return this.document.getElementById(idName);
  }

  getBoxHeight(box: HTMLElement) {
    return box.scrollHeight;
  }

  getBoxOffset() {
    return this.getAllNode(this.nodeTree).map(item => {
      return {
        id: item,
        offset: this.getOffset(this.getElement(item))
      };
    });
  }

  addJumpEvent() {
    setTimeout(() => {
      this.allNodeOffset.forEach(item => {
        try {
          const element = this.document.querySelector(`li.${item.id} a`);
          this.eventMessage.addEventListener(element, 'click', this.jumpEvent.bind(this, item.id));
        } catch (error) {
        }
      });
    });
  }

  jumpEvent(nodeId: string, event: any) {
    event.preventDefault();
    this.jumpTo = this.getOffset(this.getElement(nodeId)) - this.boxOffset > this.box.scrollHeight - this.box.offsetHeight ?
      this.box.scrollHeight - this.box.offsetHeight : this.getOffset(this.getElement(nodeId)) - this.boxOffset;
    this.box.scrollTo({
      top: this.jumpTo,
      behavior: 'smooth'
    });
    this.removeActive();
    this.addActive(nodeId);
  }

  scrollEvent(event?: any) {
    if (this.jumpTo && event) {
      if (this.jumpTo === event.target.scrollTop) {
        this.jumpTo = 0;
      }
      return;
    }
    // 确保在dom改变之后运行
    setTimeout(() => {
      let top;
      if (event) {
        top = event.target.scrollTop;
      } else {
        if (this.box) {
          top = this.box.scrollTop;
        } else {
          return;
        }
      }
      if (this.box) {
        // 这里判断box如果不变就默认为dom结构没有改变，使用缓冲。
        if (this.getBoxHeight(this.box) === this.boxHeight) {
          this.setActive(top);
        } else {
          this.boxInit();
          this.setActive(top);
        }
      }
    }, 0);
  }

  isActive(nodeId: string): boolean {
    try {
      return this.document.querySelector(`li.${nodeId}`).classList.contains('active');
    } catch (error) {
      return false;
    }
  }

  removeActive() {
    if (this.document.querySelector('li.active')) { this.document.querySelector('li.active').classList.remove('active'); }
  }

  addActive(nodeId: string) {
    try {
      this.document.querySelector(`li.${nodeId}`).classList.add('active');
    } catch (error) {
      console.error(`li.${nodeId}不存在`);
    }
  }

  setActive(top: number): void {
    if (this.allNodeOffset) {
      for (let key = 0; key < this.allNodeOffset.length; key++) {
        if (this.allNodeOffset[key].offset > top + this.boxOffset) {
          const nodeId = this.allNodeOffset[key ? key - 1 : 0].id;
          if (!this.isActive(nodeId)) {
            this.removeActive();
            this.addActive(nodeId);
          }
          break;
        }
      }
    }
  }

  getAllNode(array: Array<any>) {
    const nodeArray: Array<string> = new Array();
    const arr = JSON.parse(JSON.stringify(array));

    function resolveChild(children: Array<any>) {
      children.forEach(node => {
        if (node.id) {
          nodeArray.push(node.id);
        }
        if (node.child) { resolveChild(node.child); }
      });
    }

    resolveChild(arr);
    return nodeArray;
  }

  /**
   * 输入一个node，tree，不包含text参数
   * 返回一个node数组，补全text参数
   */

  resolveTree(array: Array<any> | undefined): Array<any> {
    if (array) {
      array.forEach(item => {
        if (item.id === undefined) {
          console.log('数据缺少id');
        }
        if (item.text === undefined) {
          item.text = item.id;
        }
        item.child = this.resolveTree(item.child);
      });
      return array;
    }
  }


  ngOnInit() {

  }

  get isIE8() {
    return navigator.userAgent.indexOf('MSIE 8.0') !== -1;
  }

  /**
   * @return 获取element相对于body的偏移量
   */

  getOffset(element: any | null): number {
    let top = 0;
    if (element) {
      top += element.offsetTop;
      element = element.offsetParent;
    }
    while (element) {
      top += element.offsetTop;
      if (!this.isIE8) {
        top += element.clientTop;
      }
      element = element.offsetParent;
    }
    return top;
  }

}
