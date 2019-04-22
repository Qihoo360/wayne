import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wayne-modal-operate',
  templateUrl: './modal-operate.component.html',
  styleUrls: ['./modal-operate.component.scss']
})
export class ModalOperateComponent implements OnInit {

  @Input() modal: any;
  fullPage: boolean;
  element: Element;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
  }

  fullPageChange(full: boolean) {
    this.fullPage = full;
    if (!this.modal) {
      throw Error('请绑定modal');
    }
    const target = this.getParentBody(this.element).querySelector('.modal-dialog');
    if (this.fullPage) {
      target.classList.add('fullPage');
    } else {
      target.classList.remove('fullPage');
    }
  }

  getParentBody(element: Element) {
    while (!element.classList.contains('modal')) {
      element = element.parentElement;
    }
    return element;
  }

}
