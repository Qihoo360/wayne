import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wayne-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})

export class CheckboxComponent implements OnInit {
  /**
   * 需要添加一个lable作为自己的value;
   */
  _value: any = '';
  checked = false;
  inputElement: HTMLInputElement;

  constructor(private el: ElementRef) {
  }

  changeEvent() {
    const event = new Event('change');
    this.inputElement.checked = !this.checked;
    this.inputElement.dispatchEvent(event);
  }

  ngOnInit() {
    this.inputElement = this.el.nativeElement.querySelector('input[type=checkbox]');
    this._value = this._value ? this._value : this.inputElement.previousSibling.nodeValue.toString();
  }

  @Input()
  set value(value) {
    if (value) {
      this._value = value;
    }
  }
}
