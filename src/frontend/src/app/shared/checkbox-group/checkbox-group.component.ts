import { Component, ContentChildren, forwardRef, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { EventManager } from '@angular/platform-browser';
import { CreateEditDaemonSetTplComponent } from 'app/portal/daemonset/create-edit-daemonsettpl/create-edit-daemonsettpl.component';

@Component({
  selector: 'wayne-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxGroupComponent),    // 这里指向当前组件
    multi: true
  }]
})

export class CheckboxGroupComponent implements ControlValueAccessor {
  value: any[] = new Array();
  _boxs: QueryList<any>;
  eventList: any[] = new Array();
  updateEmit = (_: any) => {
  }

  constructor(private eventManage: EventManager) {

  }

  @ContentChildren(CheckboxComponent)
  set boxs(boxs: QueryList<any>) {
    this._boxs = boxs;
    this.destoryEvent();
    this.initDate(boxs);
    this.addEvent(boxs);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
      if (this._boxs) {
        this.initDate(this._boxs);
      }
    }
  }

  initDate(boxs: QueryList<any>) {
    if (Object.prototype.toString.call(this.value) === '[object Array]') {
      boxs.forEach(box => {
        box.checked = this.value.indexOf(box._value) > -1 ? true : false;
      });
    }
  }

  addEvent(boxs: QueryList<any>) {
    boxs.forEach(box => {
      this.eventList.push(
        this.eventManage.addEventListener(box.el.nativeElement.querySelector('input[type=checkbox]'), 'change', this.changeEvent.bind(this))
      );
    });
  }

  destoryEvent() {
    this.eventList.forEach(event => {
      event();
    });
    this.eventList = [];
  }

  changeEvent(event) {
    this.updateEmit(this.getValueList(this._boxs));
  }

  getValueList(boxs: QueryList<any>): any[] {
    return boxs.filter(item => {
      return item.checked && item._value !== '';
    }).map(item => {
      return item._value;
    });
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }

  registerOnTouched(fn: any): void {
  }

}
