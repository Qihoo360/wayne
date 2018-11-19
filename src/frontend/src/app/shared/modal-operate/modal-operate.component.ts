import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wayne-modal-operate',
  templateUrl: './modal-operate.component.html',
  styleUrls: ['./modal-operate.component.scss']
})
export class ModalOperateComponent implements OnInit {

	@Input() modal: any;
  fullPage: boolean;
  constructor() { }

  ngOnInit() {
  }

  fullPageChange(full: boolean) {
    this.fullPage = full;
    if (!this.modal) throw Error('请绑定modal');
    if (this.fullPage) this.modal.focusTrap.elementRef.nativeElement.querySelector('.modal-dialog').classList.add('fullPage');
    else this.modal.focusTrap.elementRef.nativeElement.querySelector('.modal-dialog').classList.remove('fullPage');
  }

}
